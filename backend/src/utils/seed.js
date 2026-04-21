require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const Hospital = require('../models/Hospital');
const Vaccine = require('../models/Vaccine');
const Slot = require('../models/Slot');
const User = require('../models/User');
const Booking = require('../models/Booking');

function loadJSON(name) {
  const p = path.join(__dirname, '..', '..', '..', 'database', 'seed', name);
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

(async () => {
  try {
    await connectDB();
    await Promise.all([
      Hospital.deleteMany({}),
      Vaccine.deleteMany({}),
      Slot.deleteMany({}),
      User.deleteMany({}),
    ]);

    const hospitalsData = loadJSON('hospitals.json');
    const vaccinesData = loadJSON('vaccines.json');
    const usersData = loadJSON('users.json');

    const hospitals = await Hospital.insertMany(hospitalsData);
    const hospitalMap = Object.fromEntries(hospitals.map(h => [h.name, h._id]));

    const vaccineDocs = vaccinesData.map(v => ({
      ...v,
      hospitalId: hospitalMap[v.hospitalName],
      hospitalName: undefined,
    }));
    const vaccines = await Vaccine.insertMany(vaccineDocs);

    const today = new Date().toISOString().slice(0, 10);
    const capacities = [10, 15, 20, 25, 30, 40, 50];
    const slotDocs = [];
    for (const v of vaccines) {
      for (let i = 0; i < 14; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const cap = capacities[Math.floor(Math.random() * capacities.length)];
        slotDocs.push({
          hospitalId: v.hospitalId,
          vaccineId: v._id,
          date: d.toISOString().slice(0, 10),
          totalCapacity: cap,
          bookedCount: 0,
          pricePerDose: v.pricePerDose,
        });
      }
    }
    await Slot.insertMany(slotDocs);

    for (const u of usersData) await User.create(u);

    // load bookings.json (optional) and create bookings linked to generated slots
    try {
      const bookingsData = loadJSON('bookings.json');
      for (const b of bookingsData) {
        try {
          const user = await User.findOne({ email: b.userEmail });
          if (!user) { console.warn('Skipping booking, user not found:', b.userEmail); continue; }
          const hospitalId = hospitalMap[b.hospitalName];
          if (!hospitalId) { console.warn('Skipping booking, hospital not found:', b.hospitalName); continue; }
          const vaccine = await Vaccine.findOne({ hospitalId, name: b.vaccineName });
          if (!vaccine) { console.warn('Skipping booking, vaccine not found:', b.vaccineName); continue; }

          const days = Number.isFinite(b.daysFromNow) ? b.daysFromNow : 0;
          const d = new Date();
          d.setDate(d.getDate() + days);
          const dateStr = d.toISOString().slice(0, 10);

          const slot = await Slot.findOne({ hospitalId, vaccineId: vaccine._id, date: dateStr });
          if (!slot) { console.warn('Skipping booking, slot not found for date:', dateStr); continue; }

          const confirmationCode = Math.random().toString(36).slice(2, 10).toUpperCase();
          const bookingDoc = {
            userId: user._id,
            hospitalId,
            vaccineId: vaccine._id,
            slotId: slot._id,
            date: dateStr,
            lockedPrice: slot.pricePerDose || vaccine.pricePerDose || 0,
            patientName: b.patientName || user.name,
            patientAge: b.patientAge || 30,
            status: b.status || 'confirmed',
            confirmationCode,
          };

          await Booking.create(bookingDoc);
          // increment booked count on slot
          slot.bookedCount = (slot.bookedCount || 0) + 1;
          await slot.save();
        } catch (be) {
          console.warn('Failed to create booking entry', be);
        }
      }
    } catch (err) {
      // bookings.json is optional; ignore if missing
    }

    console.log('Seed complete:', {
      hospitals: hospitals.length,
      vaccines: vaccines.length,
      slots: slotDocs.length,
      users: usersData.length,
      startDate: today,
    });
    process.exit(0);
  } catch (err) {
    console.error('Seed failed', err);
    process.exit(1);
  }
})();

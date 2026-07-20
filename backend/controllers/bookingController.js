const Booking = require("../models/Booking");
const transporter = require("../config/email");

// Helper function to format date cleanly
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// 1. CREATE BOOKING REQUEST (Admin Alerts & Professional User Acknowledgement)
const createBooking = async(req, res) => {
        try {
            const { name, phone, email, check_in, check_out, guests, room_preference, message } = req.body;
            if (!name || !phone || !room_preference) {
                return res.status(400).json({ success: false, message: "Required fields missing" });
            }

            const newBooking = await Booking.create({ name, phone, email, check_in, check_out, guests, room_preference, message });

            const io = req.app.get("socketio");
            if (io) {
                io.emit("new_booking_request", {
                    message: `Bhai, ${name} ne ek naya booking request bheja hai!`,
                    booking: newBooking
                });
            }

            // Email logic wrapped safely to prevent blocking execution
            if (process.env.EMAIL_USER) {
                try {
                    // 🚨 ADMIN EMAIL ALERT
                    const adminMailOptions = {
                            from: process.env.EMAIL_USER,
                            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                            subject: "🚨 New Booking Request Received - Valley Medows",
                            html: `
                    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #1e293b;">
                        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px dashed #e2e8f0;">
                            <span style="font-size: 36px;">🚨</span>
                            <h2 style="color: #4f46e5; margin: 10px 0 0 0; font-size: 24px; font-weight: 700;">New Reservation Alert</h2>
                            <p style="font-size: 14px; color: #64748b; margin: 5px 0 0 0;">Valley Medows Admin Portal</p>
                        </div>
                        <div style="padding: 25px 0;">
                            <p style="font-size: 16px; line-height: 1.5; color: #334155;">Hello Admin,<br/>A new booking request has been submitted. Below are the details:</p>
                            
                            <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 15px;">
                                <tr style="background-color: #f8fafc;"><td style="padding: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #f1f5f9;">Guest Name</td><td style="padding: 12px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${name}</td></tr>
                                <tr><td style="padding: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #f1f5f9;">Phone Number</td><td style="padding: 12px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${phone}</td></tr>
                                <tr style="background-color: #f8fafc;"><td style="padding: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #f1f5f9;">Email Address</td><td style="padding: 12px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${email || "Not Provided"}</td></tr>
                                <tr><td style="padding: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #f1f5f9;">Room Preference</td><td style="padding: 12px; color: #4f46e5; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${room_preference}</td></tr>
                                <tr style="background-color: #f8fafc;"><td style="padding: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #f1f5f9;">Check-In</td><td style="padding: 12px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${formatDate(check_in)}</td></tr>
                                <tr><td style="padding: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #f1f5f9;">Check-Out</td><td style="padding: 12px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${formatDate(check_out)}</td></tr>
                                <tr style="background-color: #f8fafc;"><td style="padding: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #f1f5f9;">Total Guests</td><td style="padding: 12px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${guests || 1}</td></tr>
                            </table>
                            
                            ${message ? `<div style="margin-top: 20px; padding: 15px; background-color: #f1f5f9; border-left: 4px solid #64748b; border-radius: 4px; font-size: 14px; color: #334155; font-style: italic;"><b>Guest Note:</b> "${message}"</div>` : ''}
                        </div>
                        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
                            <p style="font-size: 13px; color: #94a3b8; margin: 0;">Please log in to your Valley Medows Dashboard to manage this booking.</p>
                        </div>
                    </div>
                    `
                };
                await transporter.sendMail(adminMailOptions);
                console.log("Admin email notification dispatched.");

                // 📩 USER ACKNOWLEDGEMENT EMAIL (Professional Redesign)
                if (email) {
                    const userReceiptOptions = {
                        from: process.env.EMAIL_USER,
                        to: email,
                        subject: "✨ We've Received Your Booking Request! - Valley Medows",
                        html: `
                        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #1e293b;">
                            <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
                                <h1 style="color: #4f46e5; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Valley Medows</h1>
                                <p style="font-size: 14px; color: #64748b; margin: 5px 0 0 0;">Your comfort is our priority</p>
                            </div>
                            
                            <div style="padding: 25px 0;">
                                <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 600;">Hello ${name},</h2>
                                <p style="font-size: 15px; line-height: 1.6; color: #334155;">Thank you for choosing Valley Medows! We have successfully received your booking inquiry. Our team is checking availability, and we will update you shortly.</p>
                                
                                <div style="background-color: #f8fafc; border: 1px solid #ebdffc; padding: 20px; border-radius: 8px; margin: 25px 0;">
                                    <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #4f46e5;">Request Summary</h3>
                                    <p style="margin: 6px 0; font-size: 15px; color: #334155;"><b>Room Selected:</b> ${room_preference}</p>
                                    <p style="margin: 6px 0; font-size: 15px; color: #334155;"><b>Check-In Date:</b> ${formatDate(check_in)}</p>
                                    <p style="margin: 6px 0; font-size: 15px; color: #334155;"><b>Check-Out Date:</b> ${formatDate(check_out)}</p>
                                </div>

                                <p style="font-size: 14px; line-height: 1.6; color: #64748b; background: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 4px;">
                                    <b>Please Note:</b> This is an acknowledgment of your request. A formal confirmation email containing your final stay voucher will be triggered once room allocation is complete.
                                </p>
                            </div>
                            
                            <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 10px;">
                                <p style="margin: 0; font-weight: 700; color: #4f46e5; font-size: 15px;">Warm Regards,</p>
                                <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">Guest Relations Team, Valley Medows</p>
                            </div>
                        </div>
                        `
                    };
                    await transporter.sendMail(userReceiptOptions);
                    console.log(`Confirmation email sent safely to user: ${email}`);
                }
            } catch (mailErr) {
                console.error("Booking Creation Mail System Error:", mailErr.message);
            }
        }

        return res.status(201).json({ success: true, message: "Booking saved successfully!", data: newBooking });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// 2. GET ALL BOOKINGS
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 3. UPDATE BOOKING STATUS (Handles Confirmed, Checked-out, Cancelled with Premium Templates)
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required" });
        }

        const rawStatus = status.toLowerCase().trim();
        let currentStatus = rawStatus;
        
        if (rawStatus === "checkedout" || rawStatus === "checked-out") {
            currentStatus = "checked-out"; 
        } else if (rawStatus === "confirmed") {
            currentStatus = "confirmed";
        } else if (rawStatus === "cancelled" || rawStatus === "canceled") {
            currentStatus = "cancelled";
        }

        const updated = await Booking.findByIdAndUpdate(
            id, { status: currentStatus }, { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ success: false, message: "Booking not found" });

        const userEmail = updated.email;
        const guestName = updated.name;
        const roomPref = updated.room_preference;

        if (userEmail && process.env.EMAIL_USER) {
            let subject = "";
            let htmlContent = "";

            // Common header utility to keep branding consistent across all status updates
            const getEmailHeader = (titleColor, statusText) => `
                <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #1e293b;">
                    <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; margin-bottom: 25px;">
                        <h1 style="color: #4f46e5; margin: 0; font-size: 24px; font-weight: 700;">Valley Medows</h1>
                        <span style="display: inline-block; margin-top: 8px; padding: 4px 12px; background-color: ${titleColor}15; color: ${titleColor}; border-radius: 20px; font-size: 13px; font-weight: 600; text-transform: uppercase;">${statusText}</span>
                    </div>
            `;

            const getEmailFooter = () => `
                    <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 25px;">
                        <p style="margin: 0; font-weight: 700; color: #4f46e5; font-size: 15px;">Warm Regards,</p>
                        <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">Team Valley Medows</p>
                    </div>
                </div>
            `;

            if (currentStatus === "confirmed") {
                subject = "🎉 Booking Confirmed! Your stay at Valley Medows is ready";
                htmlContent = `
                    ${getEmailHeader("#10b981", "Booking Confirmed")}
                    <h2 style="color: #0f172a; margin-top: 0; font-size: 18px; font-weight: 600;">Great News, ${guestName}!</h2>
                    <p style="font-size: 15px; color: #334155; line-height: 1.6;">Your reservation has been approved and successfully locked in. We are preparing everything to offer you a memorable stay experience.</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px; border: 1px solid #f1f5f9; border-radius: 8px; overflow: hidden;">
                        <tr style="background-color: #f8fafc;"><td style="padding: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #f1f5f9;">Room Type</td><td style="padding: 12px; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${roomPref}</td></tr>
                        <tr><td style="padding: 12px; font-weight: 600; color: #475569; border-bottom: 1px solid #f1f5f9;">Check-In Date</td><td style="padding: 12px; color: #10b981; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${formatDate(updated.check_in)}</td></tr>
                        <tr style="background-color: #f8fafc;"><td style="padding: 12px; font-weight: 600; color: #475569;">Check-Out Date</td><td style="padding: 12px; color: #0f172a;">${formatDate(updated.check_out)}</td></tr>
                    </table>
                    
                    <p style="font-size: 14px; color: #64748b; line-height: 1.5;">If you plan to arrive earlier than scheduled or have special boarding requirements, please contact our support desk.</p>
                    ${getEmailFooter()}
                `;
            } else if (currentStatus === "checked-out") {
                subject = "🏨 Thank you for staying with us! - Valley Medows";
                htmlContent = `
                    ${getEmailHeader("#3b82f6", "Checked Out")}
                    <h2 style="color: #0f172a; margin-top: 0; font-size: 18px; font-weight: 600;">Thank You, ${guestName}</h2>
                    <p style="font-size: 15px; color: #334155; line-height: 1.6;">Your official checkout process has been fully processed on <b>${formatDate(new Date())}</b>.</p>
                    <p style="font-size: 15px; color: #334155; line-height: 1.6;">We truly hope you enjoyed our services and hospitality during your stay. It was an absolute pleasure hosting you.</p>
                    
                    <div style="margin: 25px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 6px; font-size: 14px; color: #475569; text-align: center;">
                        Need digital prints of your final tax invoices or checkout summary ledger? Simply reply to this email, and we'll send it over.
                    </div>
                    
                    <p style="font-size: 15px; font-weight: 600; color: #4f46e5; text-align: center; margin-top: 20px;">We hope to welcome you back soon!</p>
                    ${getEmailFooter()}
                `;
            } else if (currentStatus === "cancelled") {
                subject = "⚠️ Reservation Update: Cancellation Notice - Valley Medows";
                htmlContent = `
                    ${getEmailHeader("#ef4444", "Booking Cancelled")}
                    <h2 style="color: #0f172a; margin-top: 0; font-size: 18px; font-weight: 600;">Hello ${guestName},</h2>
                    <p style="font-size: 15px; color: #334155; line-height: 1.6;">We are writing to notify you that your room booking request for <b>${roomPref}</b> has been cancelled and could not be accommodated at this time.</p>
                    
                    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px; font-size: 14px; color: #991b1b; margin: 20px 0;">
                        If any advance retention or transaction amounts were deducted, the reversal sequence will be initiated according to standard cancellation terms.
                    </div>
                    
                    <p style="font-size: 14px; color: #64748b; line-height: 1.5;">If this cancellation wasn't intended, or if you wish to adjust your schedule parameters, please feel free to raise a clean query on our web dashboard.</p>
                    ${getEmailFooter()}
                `;
            }

            if (subject && htmlContent) {
                const userMailOptions = {
                    from: process.env.EMAIL_USER,
                    to: userEmail,
                    subject: subject,
                    html: htmlContent
                };

                await transporter.sendMail(userMailOptions);
                console.log(`Status update email [${currentStatus}] successfully sent to ${userEmail}`);
            }
        }

        return res.status(200).json({ success: true, message: `Booking marked as ${currentStatus}!`, data: updated });
    } catch (error) {
        console.error("Status update email system crash:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// 4. DELETE BOOKING RECORD
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Booking.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Booking not found" });
        return res.status(200).json({ success: true, message: "Booking deleted successfully from records." });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { createBooking, getAllBookings, updateBookingStatus, deleteBooking };
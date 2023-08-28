import transporter from './transporter.js';

const verification = async (req, res) => {
  const verificationLink = `http://localhost:5000/auth/verify/${req.body.email}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: 'Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 400px; margin: 0 auto; background-color: #ffffff; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #007bff; color: #ffffff; padding: 10px 0; border-radius: 5px 5px 0 0;">
          <h1>Selamat Datang di Aplikasi Kami!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Halo,</p>
          <p>Terima kasih telah bergabung dengan kami. Kami sangat senang memiliki Anda sebagai bagian dari komunitas kami.</p>
          <p>Silakan klik tombol di bawah ini untuk verifikasi email Anda:</p>
          <a href="${verificationLink}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; margin-top: 20px; text-decoration: none; border-radius: 5px; transition: background-color 0.3s ease;">
            Verifikasi Email
          </a>
          <p>Jika Anda memiliki pertanyaan atau memerlukan bantuan, jangan ragu untuk menghubungi tim dukungan kami.</p>
        </div>
        <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border-radius: 0 0 5px 5px;">
          <p>Jangan balas email ini. Ini adalah email otomatis yang dihasilkan oleh sistem.</p>
        </div>
      </div>
    </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
      return res.status(500).json({ message: 'Failed to send verification email' });
    }
    console.log('Verification email sent:', info.response);
    return res.status(200).json({ message: 'Verification email sent' });
  });
};

export default verification;

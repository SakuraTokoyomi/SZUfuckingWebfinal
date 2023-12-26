function sendEmail() {
    Email.send({
      Host: 'smtp.qq.com',
      Username: '102760064@qq.com',
      Password: 'dssblynxlmfmbceg',
      To: 'y1027600674@163.com',
      From: '1027600674@qq.com',
      Subject: 'Test Email',
      Body: 'This is a test email'
    }).then(function(message) {
      console.log('Email sent successfully:', message);
    }).catch(function(error) {
      console.error('Failed to send email:', error);
    });
  }
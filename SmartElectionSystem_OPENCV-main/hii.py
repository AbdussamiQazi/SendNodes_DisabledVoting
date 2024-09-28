import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_email(to_email, message_body):
    # Email settings
    from_email = "vanshkadam11@gmail.com"
    from_password = "ugtx hzrt hset cmaq"  # Use an App Password for Gmail

    # Setting up the MIME
    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = to_email
    msg["Subject"] = "Notification"

    # Attach message body
    msg.attach(MIMEText(message_body, "plain"))

    # Gmail's SMTP server setup
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()  # Start TLS encryption
    server.login(from_email, from_password)  # Login to Gmail

    # Send email
    text = msg.as_string()
    server.sendmail(from_email, to_email, text)

    # Quit the server
    server.quit()
    print(f"Email sent to {to_email}")


# Example usage
if __name__ == "__main__":
    message_body = "hello gandu."
    email_list = ["vanshkadam11@gmail.com" , "qazisami76@gmail.com" , "tejasalvi47@gmail.com"]

    for email in email_list:
        send_email(email, message_body)

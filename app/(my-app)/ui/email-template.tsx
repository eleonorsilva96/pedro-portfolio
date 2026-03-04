export const EmailTemplate = ({
  firstName,
  email,
  message,
}: {
  firstName: string;
  email: string;
  message: string;
}) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#333" }}>
      <h1>Request for a quote</h1>

      <p>
        <strong>Name:</strong> {firstName}
      </p>
      <p>
        <strong>Reply to:</strong> {email}
      </p>

      <hr style={{ margin: "20px 0", borderColor: "#eee" }} />

      <h3>Message:</h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{message}</p>
    </div>
  );
};

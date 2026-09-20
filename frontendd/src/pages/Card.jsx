import { QRCodeCanvas } from "qrcode.react";

export default function Card() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <p>No user found</p>;

  const isAdmin = user.role === "admin";
  const memberNumber = user.memberNumber || "N/A";

  return (
    <div className="card">
      <h2>Member Card</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Member ID:</strong> {memberNumber}</p>
      <p><strong>Role:</strong> {isAdmin ? "Administrator" : "Member"}</p>
      <QRCodeCanvas value={user._id} />
    </div>
  );
}
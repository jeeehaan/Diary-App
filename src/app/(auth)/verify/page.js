import React from "react";

async function verify(userId, code) {
  const res = await fetch("http://localhost:3000/api/v1/auth/verify", {
    method: "POST",
    body: JSON.stringify({ userId, code }),
    cache: "no-store",
  });
}
export default async function Page({ searchParams }) {
  const userId = searchParams.userid;
  const code = searchParams.code;
  await verify(userId, code);

  return <div>Verify</div>;
}

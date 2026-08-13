import { cookies } from "next/headers";
import { getIronSession, type IronSession } from "iron-session";

export interface SessionData {
  adminId?: string;
  username?: string;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "mc_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 14, // 14 дней
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const session = await getSession();
  return Boolean(session.adminId);
}

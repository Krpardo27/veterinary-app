import { headers } from "next/headers";
import { auth } from "./auth";
// import { getAdminAccessForEmail, hasPermission, isSuperAdminEmail, type AdminPermission } from "./roles";

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

// export async function requireAdminAction(permission?: AdminPermission) {
//   const session = await getServerSession();
//   const access = await getAdminAccessForEmail(session?.user.email);
//   const allowed = permission ? hasPermission(access, permission) : access.allowed;

//   if (!allowed) {
//     return { error: "No tienes permisos para realizar esta acción" };
//   }

//   return { error: null };
// }

// export async function requireSuperAdminAction() {
//   const session = await getServerSession();

//   if (!isSuperAdminEmail(session?.user.email)) {
//     return { error: "No tienes permisos de super admin" };
//   }

//   return { error: null };
// }

export async function requireAuth() {
  try {
    const session = await getServerSession();

    return {
      session,
      isAuth: !!session,
    };
  } catch (error) {
    console.error(error);

    return {
      session: null,
      isAuth: false,
    };
  }
}

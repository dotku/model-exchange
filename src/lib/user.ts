import { prisma } from "./prisma";
import { auth0 } from "./auth0";

export async function getOrCreateUser() {
  const session = await auth0.getSession();
  if (!session) return null;

  const { sub, email, name, picture } = session.user;

  const user = await prisma.user.upsert({
    where: { auth0Id: sub as string },
    update: { email: email as string, name: name ?? null, picture: picture ?? null },
    create: { auth0Id: sub as string, email: email as string, name: name ?? null, picture: picture ?? null },
  });

  return user;
}

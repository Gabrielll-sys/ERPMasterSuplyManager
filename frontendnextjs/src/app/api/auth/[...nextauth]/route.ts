import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Login with Google
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  // callbacks: {
  //   async jwt({ token, user }: any) {
  //     if (user) {
  //       // O token do Google deve estar disponível na propriedade `user.id_token`.
  //       token.idToken = user.id_token;
  //       console.log(token.idToken);
  //     }
  //     console.log(token);
  //     console.log(token.idToken);
  //     return token;
  //   },
  // },
});

export { handler as GET, handler as POST };

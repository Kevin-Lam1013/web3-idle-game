import { useUser } from "@thirdweb-dev/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getUser } from "./api/auth/[...thirdweb]";
import Worker from "../components/Worker";

const Home: NextPage = () => {
  const { isLoggedIn, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  return (
    <div>
      <Worker />
    </div>
  );
};

export default Home;

export async function getServerSideProps(context: any) {
  const user = await getUser(context.req);

  if(!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      }
    }
  }

  return {
    props: {},
  };
}
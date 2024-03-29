import { createContext, useEffect, useState, useRef } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { useRouter } from "next/router";
import Notifications from "../components/Notifications";
import Messages from "../components/Messages";
import AddPost from "../components/AddPost";
import axios from "axios";
import { Accordion } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedInUser } from "@/store/userSlice";

export const AuthContext = createContext();

export default function AuthLayout({ children }) {
  const [dateState, setDateState] = useState(new Date());

  const [openSliders, setOpenSliders] = useState({
    messages: false,
    notifications: false,
    addPost: false,
  });

  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.user);
  const drawerRef = useRef(null);

  useEffect(() => {
    // setInterval(() => setDateState(new Date()), 30000);

    const fetchLoggedUser = async () => {
      try {
        const response = await axios.get("/api/getloggedinuser");

        dispatch(setLoggedInUser(response.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchLoggedUser();
  }, []);

  // console.log({ loggedInUser });
  async function logout() {
    // console.log("clicked");
    try {
      const response = await axios.post("/api/logout");
      console.log(response);
      if (response) {
        dispatch(setLoggedInUser(""));
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function toggleSliders(slider) {
    Object.keys(openSliders).map((i) => {
      setOpenSliders((prev) => ({
        ...prev,
        [i]: false,
        [slider]: true,
      }));
    });
  }
  console.log({ openSliders });
  const router = useRouter();
  const { asPath } = router;
  const [posted, setPosted] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        toggleSliders: toggleSliders,

        posted,
      }}
    >
      <div className="w-full h-full overflow-clip  overflow-x-hidden">
        {loggedInUser && (
          <NavBar user={loggedInUser} asPath={asPath} logout={logout} />
        )}
        <div className="bg-[#161616] h-full">
          <div className="flex text-white h-full ">
            <SideBar user={loggedInUser} />
            <div className="md:w-[50%] h-full overflow-y-auto  px-3 flex justify-center  ">
              <AddPost
                toggleSliders={toggleSliders}
                setOpenSliders={setOpenSliders}
                isOpen={openSliders.addPost}
              />

              <div className="w-full mt-16">{children}</div>
            </div>

            <div className=" w-[30%] hidden md:block mx-2 space-y-2 mt-14">
              <div className="bg-zinc-800 h-auto text-white rounded mt-2 shadow">
                <Accordion
                  defaultValue="customization"
                  chevronPosition="right"
                  chevron=""
                  unstyled
                >
                  <Accordion.Item value="customization">
                    <Accordion.Control className="text-white hover:bg-zinc-700 border-b-0 w-full">
                      <div className="text-white w-full font-semibold py-2  flex justify-between">
                        <div className="px-2">
                          Today Trending{" "}
                          <span className="text-pink-600">...</span>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                          />
                        </svg>
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel className="cursor-pointer">
                      <div className="text-white bg-zinc-900   rounded px-4 py-4">
                        Colors, fonts, shadows and many other parts are
                        customizable to fit your design needs
                        <hr className="my-3 bg-slate-800" />
                        <div className="text-cyan-500 text-center font-semibold hover:text-cyan-400">
                          See all
                        </div>
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </div>
              <div className="bg-zinc-800 h-auto rounded shadow-md ">
                <Accordion
                  defaultValue="customization"
                  chevronPosition="right"
                  chevron=""
                  unstyled
                >
                  <Accordion.Item value="customization">
                    <Accordion.Control className="text-white hover:bg-zinc-700 border-b-0 w-full">
                      <div className="text-white w-full font-semibold py-2  flex justify-between">
                        <div className="px-2">
                          Suggested For You
                          <span className="text-pink-600">...</span>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                          />
                        </svg>
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel className="cursor-pointer">
                      <div className="text-white bg-zinc-900   rounded px-4 py-4">
                        Colors, fonts, shadows and many other parts are
                        customizable to fit your design needs
                        <hr className="my-3 bg-slate-800" />
                        <div className="text-cyan-500 text-center font-semibold hover:text-cyan-400">
                          See all
                        </div>
                      </div>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </div>
              <div className="absolute right-3 top-16 w-[25%]">
                <Notifications
                  setOpenSliders={setOpenSliders}
                  isOpen={openSliders.notifications}
                />
                <Messages
                  setOpenSliders={setOpenSliders}
                  isOpen={openSliders.messages}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
}

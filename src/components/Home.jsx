import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosAuth from "../axios-auth";

import socketIO from 'socket.io-client'
const socket = socketIO.connect('http://localhost:3000')

function Home() {
  const [chats, setChats] = useState([])
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const senderId = localStorage.getItem("user_id")
  const [messageToSend, setMessageToSend] = useState({
    message: "",
    chatId: "",
    senderId: ""
  })

  const onMessageChange = (e) => {
    setMessageToSend({ ...messageToSend, [e.target.name]: e.target.value, chatId: selectedChat, senderId: senderId})
  }

  const onMessageSubmit = (e) => {
    e.preventDefault()
    // console.log(messageToSend)
    axiosAuth
    .post("http://localhost:3000/api/message", messageToSend)
    .then((res) => {
      setMessageToSend({
        message: "",
        chatId: "",
        senderId: ""
      })
      socket.emit('sendMessage', { chat_id: messageToSend.chatId })
      clearMessage()
      getMessages(messageToSend.chatId)
    })
    .catch((err) => {
      console.log("error send message")
    })
  }
  const clearMessage = () => {
    document.getElementById("message").value = "";
  }

  const navigate = useNavigate();
  useEffect(() => {
    axiosAuth
      .get("http://localhost:3000/api/user/home")
      .then((response) => {
        // console.log(response.data.chats)
        setChats(response.data.chats);
        // console.log(response.data.usersOnChat)
        setUsers(response.data.usersOnChat);
      })
      .catch((err) => {
        console.log("error home");
        navigate("/login");
      });
    
    // // Listen for new messages from the server
    // socket.on('chat_<chat_id>', ({ chat_id }) => {
    //   // Update messages state when a new message is received
    //   // setMessages((prevMessages) => [...prevMessages, message]);
    //   alert(chat_id)
    // });

    // return () => {
    //   // Clean up the socket connection when the component unmounts
    //   socket.disconnect();
    // };

  }, []);
  useEffect(() => {
    socket.on(`chat_${selectedChat}`, (data) => {
      getMessages(data.chat_id)
    })
  }, [selectedChat])
  useEffect(() => {
    axiosAuth
      .get("http://localhost:3000/api/user/")
      .then((response) => {
        // console.log(response.data.users)
        // setUsers(response.data.users);
      })
      .catch((err) => {
        console.log("error home");
        navigate("/login");
      });
  }, []);

  const getMessages = (chat_id) => {
    axiosAuth
      .get(`http://localhost:3000/api/message/${chat_id}`)
      .then((response) => {
        // console.log(response.data.messages)
        setMessages(response.data.messages);
        setSelectedChat(chat_id)
        clearMessage()
      })
      .catch((err) => {
        console.log("error home");
      });
  }


  // function getMesseges(chat_id) {
  //   alert(chat_id)
  //     axiosAuth
  //       .get(`http://localhost:3000/api/message/${chat_id}`)
  //       .then((response) => {
  //         console.log(response.data.messages)
  //         setMessages(response.data.messages);
  //       })
  //       .catch((err) => {
  //         console.log("error home");
  //       });
  // }


  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <a href="#" className="flex ms-2 md:me-24">
                <img
                  src="/icon.png"
                  className="h-8 me-3"
                  alt="Echat Logo"
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap invisible sm:visible dark:text-white">
                  <img className="h-5" src="/logotype.png" alt="" />
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div className="rounded-full bg-white">
                  <input type="text" className="rounded-full px-3 py-1" placeholder="Search user..." />
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <button
                    type="button"
                    className="flex text-sm bg-white p-2 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown-user"
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-6 h-6 rounded-full"
                      src="/user_default.svg"
                      alt="user photo"
                    />
                  </button>
                </div>
                <div
                  className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                  id="dropdown-user"
                >
                  <div className="px-4 py-3" role="none">
                    <p
                      className="text-sm text-gray-900 dark:text-white"
                      role="none"
                    >
                      Neil Sims
                    </p>
                    <p
                      className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                      role="none"
                    >
                      neil.sims@flowbite.com
                    </p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Earnings
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {chats.map((chat) => (
              <Chat chat={chat} users={users} key={chat._id} getMessages={getMessages}/>
            ))}
          </ul>
        </div>
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <div className="text-gray-700">
            {messages.map((message) => (
            <Message message={message} key={message._id}/>
            ))}
          </div>
          {selectedChat !== null && (
          <form className="flex space-x-2" onSubmit={onMessageSubmit}>
            <input type="text" id="message" name="message" onChange={onMessageChange}  className=" px-4 rounded-full w-full bg-white border border-slate-500"/>
            <button type="submit" className="bg-slate-500 p-2 w-11 h-11 text-white rounded-full">
              <img src="/send.svg" className="object-contain" alt="" />
            </button>
          </form>
          )}
        </div>
      </div>

    </>
  );
}

function Chat({chat, users, getMessages}) {

  const logged_user_id = localStorage.getItem("user_id")
  
  // Check if user_id_1 is not the logged-in user
  let receiver_id = chat.user_id_1 !== logged_user_id ? chat.user_id_1 : null;

  // If user_id_1 is the logged-in user, check user_id_2
  if (!receiver_id) {
    receiver_id = chat.user_id_2 !== logged_user_id ? chat.user_id_2 : null;
  }
  const receiver = users.find((user) => user._id === receiver_id);
  return (
    <li key={chat._id}>
      <a
        href="#"
        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
        onClick={() => getMessages(chat._id)}
      >
        <svg
          className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 18"
        >
          <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
        </svg>
        <span className="flex-1 ms-3 whitespace-nowrap">{receiver.username}</span>
      </a>
      </li>
  );
}

function Message({message}) {
  const senderId = localStorage.getItem("user_id")
  return (
    <>
    <div className={`${message.senderId === senderId ? 'flex justify-end mb-2' : 'flex justify-start mb-1' }`}>
      <div className="bg-slate-400 px-3 py-1 rounded-full">{message.message}</div>
    </div>
    </>
  )
}
// const Home = () => {
//   return (
//     <>
//       <div classNameNameName='text-red-600'>this is homepage</div>
//     </>
//   )
// }

export default Home;

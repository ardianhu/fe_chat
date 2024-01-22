import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value})
  }

  const onSubmit = (e) => {
    e.preventDefault()
    axios
    .post("http://localhost:3000/api/user/login", user)
    .then((res) => {
      setUser({
        username: "",
        password: ""
      })
      console.log(res.data.token)
      const token = res.data.token
      const user_id = res.data.user_id

      localStorage.setItem("token", token)
      localStorage.setItem("user_id", user_id)

      navigate("/")
    })
    .catch((err) => {
      console.log("error register")
    })
  }


  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-full max-w-xs">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={onSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                name="username"
                value={user.username}
                onChange={onChange}
                placeholder="Username"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                name="password"
                value={user.password}
                onChange={onChange}
                placeholder="******************"
              />
              <p className="text-red-500 text-xs italic">
                Please input a password.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="sumbit"
              >
                Sign In
              </button>
              <a
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="#"
              >
                Forgot Password?
              </a>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2023 eChat Inc. All rights reserved.
          </p>
        </div>
      </div>
    </>
  )
}

export default Login
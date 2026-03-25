import axios from 'axios'
import React from 'react'

export const API = axios.create({
  baseURL : "https://todolist-usingexpressandmongo.onrender.com/"
});

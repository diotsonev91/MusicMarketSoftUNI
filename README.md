# MusicMarketSoftUNI

A marketplace web application for musicians to buy and sell used musical instruments and gear. Built with Angular for the frontend, Node.js/Express and MongoDB for the backend, and Firebase for image storage.

## Project Overview

This is a marketplace web application for musicians to buy and sell second-hand instruments and music equipment, built with **Angular (v18.2.10)** and a **Node.js/Express** backend with **MongoDB** as the database. Inspired by OLX but focused on the music community, this project allows users to post ads, browse listings, and connect with other musicians. Firebase is used specifically for storing ad images, with URLs stored in MongoDB for efficient retrieval.

## Folder Structure

The project is organized into two main folders:

- **Frontend/**: Contains the Angular application code for the user interface and client-side logic.
- **Backend/**: Contains the Node.js/Express server code, MongoDB configurations, and Firebase storage integration.

## Features (Planned)

- **Public Part**: Browse ads without logging in.
- **Private Part**: Post, edit, and manage ads (for registered users).
- **Search and Filter**: Find specific instruments or equipment by category, condition, or other criteria.
- **User Profiles**: View and manage personal ads, connect with other users.

## Tech Stack

- **Frontend**: Angular (v18.2.10)
- **Backend**: Node.js/Express with MongoDB
  - **MongoDB**: For storing ad listings, user data, and other backend data.
  - **Firebase Storage**: For handling image uploads, with image URLs saved in MongoDB.

## Setup Instructions

1. **Clone the repository**.
   ```bash
   git clone https://github.com/diotsonev91/AngularMusicMarketplace.git

### Backend Setup
2.Navigate to the Backend folder. 
	cd AngularMusicMarketplace/Backend
3. Install backend dependencies.
  npm install

4. Set up environment variables:
 If not set at the day of exam will provide the file 
5.Run the Backend Server:
  -Start the backend server by running server.js. The server will open on the port defined in the .env file or default to 5000.
  node server.js






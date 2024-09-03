# Exam Timetable Integration with Calendar Apps

## Overview

Managing exam timetables can be cumbersome, especially when having to sift through PDF files and search manually. This project aims to create an interactive and user-friendly web application to streamline this process. The application will allow users to easily find their exam timetables and integrate them with their calendar apps (Google Calendar, Outlook, Apple Calendar).

## Features

1. **Interactive Timetable Search**: 
   - Users can search for their exam timetable by specifying their class and year.
   - A user-friendly selector makes it easy to filter and locate the relevant timetable.

2. **Calendar Integration**:
   - **Google Calendar**: Users can authenticate using OAuth2 and sync their exam timetable with Google Calendar.
   - **Outlook and Apple Calendar** (future feature): Integration with these calendars to be implemented, allowing broader usability.

## Demo

[Insert gif or link to demo here]

## Roadmap

1. **Develop Application Skeleton**:
   - Create the basic structure of the Flask application.

2. **PDF Rendering**:
   - Implement a feature to view exam timetables directly within the application.

3. **OAuth2 Authentication**:
   - Integrate OAuth2 for secure login and authentication with Google accounts.

4. **Google Calendar Integration**:
   - Implement functionality to add exam timetable entries to Google Calendar.

5. **Outlook and Apple Calendar Integration**:
   - Explore and integrate APIs for Outlook and Apple Calendar.

## Setup

### Prerequisites

- Python 3.x
- Flask
- `requests` library for API interactions
- OAuth2 client library


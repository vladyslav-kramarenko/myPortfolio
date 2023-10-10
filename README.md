# My Portfolio Website

Welcome to my portfolio website! This website showcases my skills, experiences, and projects. You can visit the live website [here](https://www.kramarenko.info/).

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project is a personal portfolio website built using Angular. It serves as a platform to display information about me, my skills, experiences, and projects. The website is designed to be responsive and user-friendly, making it easy for visitors to learn more about me and my work.

## Project Structure

The project is organized into different components and modules to ensure a clean and maintainable codebase. Here's an overview of the main project files:

- **main.ts**: The entry point of the Angular application, responsible for bootstrapping the AppModule.

- **app.component.html**: The main layout of the application, including a navigation sidebar and a router outlet for displaying different sections.

- **app-routing.module.ts**: Defines the application's routes, including the main page and portfolio item pages.

- **app.component.ts**: Manages the state of the sidebar and handles its behavior.

- **app.module.ts**: Configures the Angular modules and imports necessary dependencies.

- **main.component.html**: The template for the main page, displaying various sections such as main title, summary, skills, experience, education, publications, courses, and contacts.

- **main.component.ts**: Contains logic for scrolling to specific sections when the URL includes a fragment.

- **main.module.ts**: The main module of the application, which declares and exports components responsible for different sections of the portfolio website. It also imports required Angular modules, such as CommonModule, LightboxModule, and HttpClientModule, to support the functionality of these components.

- **src/assets/data**: This folder contains JSON files that store the data for various sections of the portfolio website. You can use these files to easily edit and update your portfolio content without modifying the codebase directly.

## Usage

To run the portfolio website locally, follow these steps:

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd portfolio-website
2. Install dependencies:
   ```sh
   npm install
3. Start the development server:
   ```sh
   ng serve
4. Open your web browser and navigate to http://localhost:4200/ to view the website.
   Feel free to explore the code, make modifications, and customize the content to match your own portfolio.

## Contributing
If you'd like to contribute to this project or report issues.

## License
This project is licensed under the MIT License

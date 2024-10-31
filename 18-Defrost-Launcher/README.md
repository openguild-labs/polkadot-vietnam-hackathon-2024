# ❄ DEFROST LAUNCHER 🚀

<h3 align="center">DEFROST LAUNCHER</h3>
<p align="center">
Defrost Launcher is a platform for facilitating Initial DEX Offerings (IDOs) on decentralized exchanges.
</p>

<p align="center">
    <img src="https://i.pinimg.com/736x/fe/9d/38/fe9d3827959516de0885ef81d51202c7.jpg" alt="logo-white" width="150" height="150"/>
</p>

---

## Table of Contents 🏆
- [Introduction](#introduction)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

## Introduction 📕

**Defrost Launcher** is a cutting-edge decentralized platform designed to empower the crypto community by enabling users to fund promising crypto projects seamlessly. Leveraging the robust capabilities of Bifrost, Defrost Launcher offers unparalleled cross-chain interoperability, ensuring a smooth and secure funding experience across multiple blockchain networks.

Whether you're an investor looking to support innovative projects or a developer seeking funding for your crypto venture, Defrost Launcher provides the tools and incentives to foster growth and success in the decentralized ecosystem.

<p align="center">
  <img src="https://i.pinimg.com/736x/fe/9d/38/fe9d3827959516de0885ef81d51202c7.jpg" alt="logo-white" width="150" height="150"/>
</p>


## Features ☕

- **Decentralized Fundraising**: With Defrost Launcher, we facilitate seamless and secure Initial DEX Offerings (IDOs), allowing projects to raise funds directly from the community without intermediaries.

- **Multi-Chain Support**: Our platform is integrated with **Bifrost technology**, enabling support for multiple blockchain networks. This functionality allows projects to leverage diverse assets from different networks, enhancing flexibility and reach for project owners and investors alike.

- **Double Staking with vAssets**: Thanks to **Bifrost's SLPX**, users can take advantage of our **vAsset** system by locking their assets and earning rewards based on the amount of tokens they have locked. These rewards are distributed in the form of the corresponding project tokens for the investments made. While their tokens are locked, users retain the ability to utilize them for various activities within the ecosystem, including staking and trading. This innovative feature empowers users to maximize their earnings while maintaining liquidity, transforming their locked assets into versatile tools for growth.

- **Enhanced Parachains Volume**: By utilizing **vAssets**, our platform contributes to increasing the transaction volume within the Parachains ecosystem. As users lock their assets in vAssets, they actively participate in more transactions, boosting overall activity. This heightened engagement not only enhances the liquidity of the ecosystem but also drives greater visibility and growth for projects on Parachains, reinforcing a vibrant and dynamic network.

- **Flexibility for Project Owners**: Project owners enjoy the flexibility of choosing between withdrawing vAssets or receiving the corresponding native assets of those vAssets, thanks to the implementation of **Bifrost's SLXP**. This adaptability allows project owners to strategize their asset management according to their needs, ensuring they can respond effectively to market conditions while maximizing the potential of their fundraising efforts.

- **Custom Project Pool Launch**: Our IDO platform acts as a contract factory, enabling project owners to create custom project pool contracts tailored to their specific needs. With full ownership of these contracts, project owners can ensure transparency and build trust with investors, as all terms and conditions are clearly defined and managed within their dedicated pools.

- **Custom Project Pool Launch**: Our IDO platform serves as a robust contract factory, empowering project owners to create highly customizable project pool contracts tailored to their specific needs and goals. Project owners have the flexibility to select their preferred vAsset across Parachains ecosystem. With complete ownership of these custom contracts, project owners can ensure transparency and foster trust with investors, as all terms and conditions are clearly outlined and managed within their dedicated pools. This level of customization not only enhances the fundraising experience but also aligns project objectives with investor expectations, paving the way for successful project launches and ongoing engagement.

- **Enhanced Security**: We prioritize security in our contract design, ensuring fairness for both project owners and investors. Funds raised in the project pool are only accessible to the owner after the designated project pool timeframe has concluded, at which point they can withdraw the vAssets raised. Investors receive their project tokens in return, guaranteeing a structured and secure transaction process that protects the interests of all parties involved.

## How It Works 🛠️

1. **Explore High-Potential Projects**  
   - Browse through a carefully curated list of innovative crypto projects vetted for growth potential and quality. Our platform presents only the most promising projects, enabling you to make well-informed investment choices.

2. **Invest in Projects with Flexibility**  
   - Select your preferred project and choose from a variety of supported cryptocurrencies, enabled by Bifrost’s multi-chain compatibility. Each project provides transparent funding options, giving you the confidence to invest on your terms.

3. **Earn Rewards & Share in Project Success**  
   - Receive attractive rewards based on your investment level and the project’s performance. Our platform's reward structure is designed to maximize your returns, allowing you to benefit as projects achieve their milestones.

4. **Effortless Cross-Chain Asset Management**  
   - Leverage Bifrost’s interoperability for seamless asset management and transfers across different blockchain networks. Our platform provides flexible, cross-chain transactions, ensuring you can manage and move assets with ease and security.

<!-- ![Workflow Diagram](https://your-repo-url.com/workflow.png) Replace with your actual workflow diagram URL -->

## Tech Stack 💻

- **Smart Contracts**: [Solidity](https://soliditylang.org/)
- **Development Framework**: [Foundry](https://github.com/foundry-rs/foundry)
- **Frontend**: [Next.js](https://nextjs.org/), [Redux](https://redux.js.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Blockchain Integration**: [thirdweb](https://thirdweb.com/), [ethers.js](https://ethers.org/)
- **Backend**: [Prisma](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/)
- **Containerization**: [Docker](https://www.docker.com/)
- **Scripting**: [TypeScript](https://www.typescriptlang.org/)

## Demo 🎥

Check out our live demo to see Defrost Launcher in action!

👉 [Live Demo](https://youtu.be/XiIP5ktAKu8?si=hQfhgTFY4VAAa4hm) <!-- Replace with actual demo link -->

![Demo GIF](https://your-repo-url.com/demo.gif) <!-- Replace with actual demo GIF URL -->

## Installation 📦

Follow these steps to set up the project locally:

1. **Clone the Repository**
   ```sh
   git clone
   cd defrost-launcher
    ```

2. **Install Dependencies**
    ```sh
    npm install
    ```

3. **Set Up Environment Variables**
    - Create a `.env` file in the root directory.
    - Add the following environment variables:
        ```env
        MVP_DB_URL=your_database_url
        ```
    - Then go to defrost-indexer folder and create a `.env` file in the root directory.
    - Add the following environment variables:
        ```env
        DB_NAME=your_database_name
        DB_USER=your_database_user
        DB_PASSWORD=your_database_password
        GQL_URL=your_graphql_url
        ```
4. **Run Containers**
    ```sh
    docker-compose up -d
    ```
5. **Schema Generation**
    ```sh
    npx prisma db push
    npx prisma generate
    ```
6. **Run local node**
    ```sh
    tsx src/utils/setupLocalNode.ts

7. **Run the Application**
    ```sh
    npm run dev
    ```
Access the Application Open http://localhost:3000 in your browser.

## Team Core 🎮

1. **[notlongfen](https://github.com/notlongfen)**  
   Full Stack & Blockchain Developer  
   A dynamic developer with a deep focus on smart contracts and decentralized applications. Notlongfen is committed to building secure, scalable blockchain solutions that elevate user experience and ecosystem functionality.

2. **[ducmint864](https://github.com/ducmint864)**  
   Full Stack & Blockchain Developer  
   Specializing in seamless front-end and back-end integration, Ducmint864 crafts efficient and user-centric applications. Their approach ensures that complex blockchain interactions are accessible, intuitive, and responsive for all users.

3. **[nguyenkhanh0209](https://github.com/nguyenkhanh0209)**  
   Full Stack & Blockchain Developer  
   With expertise in end-to-end application development and data integrity, NguyenKhanh0209 focuses on building reliable, scalable architectures. Their contributions ensure our platform's backend remains robust, secure, and capable of supporting our decentralized projects.

4. **[Trong-tra](https://github.com/Trong-tra)**  
   Full Stack & Blockchain Developer  
   A strategic thinker with a keen eye on cross-chain compatibility and decentralized finance applications. Trong-tra leverages deep technical knowledge to drive the platform’s growth, ensuring seamless blockchain interactions across networks.


<!-- ## Contributing 🌟

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
    ```sh
    git clone
    ```

2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
    ```sh
    git checkout -b feature/AmazingFeature
    ```
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
    ```sh
    git commit -m 'Add some AmazingFeature'
    ```
4. Push to the Branch (`git push origin feature/AmazingFeature`)
    ```sh
    git push origin feature/AmazingFeature
    ```
5. Open a Pull Request
    ```sh
    git pull origin feature/AmazingFeature
    ```
## Roadmap 🗺️

See the [open issues]() for a list of proposed features (and known issues). -->

<!-- ## License 

Distributed under the MIT License. See `LICENSE` for more information. -->

<!-- ## Contact 📧

- **Project Link**: [Defrost Launcher](
- **Email**: [
- **Discord**: [Defrost Launcher](https://discord.com/invite/defrost-launcher)
- **Twitter**: [@defrost-launcher](https://twitter.com/defrost-launcher)
- **LinkedIn**: [Defrost Launcher](https://www.linkedin.com/company/defrost-launcher) -->

---

Made with ❤️ by Defrost Launcher Team





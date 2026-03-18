![Banner](https://raw.githubusercontent.com/Vishnu-Yadav0/Revshop-frontend/dev/banner.png)

# 🌐 RevShop — Frontend (Angular 17)

A modern, responsive, and role-based e-commerce storefront for Buyers, Sellers, and Delivery Partners. Built with **Angular 17** and designed to communicate with a modular microservices backend.

[![Angular](https://img.shields.io/badge/Angular-17-dd0031?style=flat-square&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue?style=flat-square&logo=docker)](https://www.docker.com/)

---

## Project Overview

RevShop serves as a full-stack monolithic-to-microservices modernized storefront. It provides dedicated management dashboards for different user roles while maintaining a seamless, high-performance shopping experience.

### 🎭 User Roles
- **Buyers:** Browse products, search categories, manage cart, checkout, track orders, and interact with AI.
- **Sellers:** Product management, inventory tracking, sales overview, and return handling.
- **Shippers:** Login dedicated portal for shipment management and tracking updates.

## Key Features
- **AI Integration:** Integrated "RevShop AI" shopping assistant for real-time support.
- **Role-Based Routing:** Secure dashboards protected by Angular Auth Guards.
- **Modern UI:** Glassmorphism-inspired design with rich animations and responsive layouts.
- **Distributed Ready:** Intercepts outgoing requests to attach JWT tokens and handles load-balanced API routing.

---

## 🛠️ Microservices Ecosystem

RevShop is powered by a set of specialized microservices. Explore the repositories below:

### ⚙️ Core Business Logic
| Repository | Description |
|---|---|
| [👤 User Service](https://github.com/Vishnu-Yadav0/Revshop-user-service) | Authentication, JWT, and RBAC management. |
| [🛍️ Product Catalog](https://github.com/Vishnu-Yadav0/Revshop-product-catalog-service) | Product listings, search, and catalog management. |
| [📦 Inventory Service](https://github.com/Vishnu-Yadav0/Revshop-inventory-service) | Stock tracking and low-stock notification triggers. |
| [🛒 Order & Sales](https://github.com/Vishnu-Yadav0/Revshop-order-sales-service) | Order lifecycle, returns, and buyer/seller dashboards. |
| [💳 Payment Service](https://github.com/Vishnu-Yadav0/Revshop-payment-service) | Transaction simulations and Twilio OTP verification. |
| [🔔 Notification Service](https://github.com/Vishnu-Yadav0/Revshop-notification-service) | Email alerts, low-stock warnings, and tracking updates. |
| [🚚 Shipping Service](https://github.com/Vishnu-Yadav0/Revshop-shipping-service) | Logistical management and courier assignment. |
| [🤖 AI Chat Service](https://github.com/Vishnu-Yadav0/Revshop-ai-chat-service) | Spring AI + Ollama powered shopping assistant. |
| [🛒 Cart Service](https://github.com/Vishnu-Yadav0/Revshop-order-sales-service) | *(Integrated into Order/Sales domain logic)* |

### 🛰️ Infrastructure & DevOps
| Repository | Description |
|---|---|
| [⚙️ API Gateway](https://github.com/Vishnu-Yadav0/Revshop-api-gateway) | Routing, Rate-limiting, and Resilience4j circuit breakers. |
| [🔍 Service Discovery](https://github.com/Vishnu-Yadav0/Revshop-service-discovery) | Netflix Eureka Server for dynamic registration. |
| [🗂️ Config Server](https://github.com/Vishnu-Yadav0/Revshop-config-server) | Centralized, environment-aware configuration. |

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Angular CLI (v17+)
- Docker (optional)

### Installation
```bash
npm install
npm run start
```
The app will be available at `http://localhost:4200`.

---

## Cloud Deployment
- **UI Hosting:** AWS S3 + CloudFront
- **Backend:** AWS EC2 (Containers)
- **CI/CD:** Jenkins / GitHub Actions


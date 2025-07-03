# E-Commerce Microservices Log Simulation Platform

## 1. Overview

This project is a full-stack e-commerce application designed to simulate a real-world enterprise system using a microservices architecture. Its primary goal is to showcase a decoupled system and generate a rich, realistic stream of structured logs for demonstrating monitoring and observability principles in a production-like environment.

## 2. System Architecture

* **Frontend**: A single-page application (SPA) built with React and served by a lightweight Nginx web server.
* **Backend Microservices**: Three independent Node.js/Express services representing core business domains: Catalog, Cart, and Orders.
* **API Routing**:
    * **Local**: Nginx acts as a reverse proxy, routing API calls to the appropriate backend container.
    * **Cloud (EKS)**: A Kubernetes Ingress resource manages path-based routing to the backend services.
* **Containerization**: All services are containerized with Docker for consistent environments.
* **Orchestration**:
    * **Local**: Docker Compose is used to run the multi-container application.
    * **Cloud**: Kubernetes (Amazon EKS) is the target production environment.

## 3. Core Features

* **Decoupled Microservices**: Services for catalog, cart, and orders are independently deployable.
* **Structured JSON Logging**: Utilizes `winston` for production-grade, analyzable logs.
* **Realistic Log Simulation**: Generates logs for API interactions, background tasks (e.g., inventory sync), and simulated business transactions (successful/failed payments).
* **Error Simulation**: Each backend service includes a dedicated `/error` endpoint to test failure monitoring.
* **Environment-Agnostic Frontend**: A single frontend build works seamlessly across both local and cloud environments without code changes.

## 4. Project Structure
```
nexus-ecommerce-app/
├── backend/
│   ├── catalog-service/
│   ├── cart-service/
│   └── order-service/
├── frontend/
├── docker-compose.yml
└── k8s-manifests
```

## 5. Local Development

### Prerequisites

* Docker & Docker Compose
* Node.js & npm

### Execution

1.  **Install Dependencies**: Navigate into each of the three backend service directories and run `npm install`.
2.  **Run with Docker Compose**: From the root `ecommerce-app` directory, execute:
    ```
    docker-compose up --build
    ```
3.  **Access Application**: Navigate to `http://localhost:8080`.
4.  **Simulate Error**: Navigate to `http://localhost:8080/error`.
5.  **View Logs**: In a new terminal, view a service's log stream:
    ```
    docker-compose logs -f order-service
    ```

## 6. Cloud Deployment to Amazon EKS

### Prerequisites

* An active AWS Account & configured AWS CLI
* `kubectl` & `eksctl`
* An ECR repository for each of the four services
* An EKS cluster with the AWS Load Balancer Controller installed

### Deployment Steps

1.  **Build and Push Docker Images** to your Amazon ECR repositories.
2.  **Configure Kubernetes Manifests**: In `k8s-deployment.yaml`, replace the ECR image path placeholder with your actual ECR URI.
3.  **Deploy to EKS**: Apply the manifest to your cluster:
    ```
    kubectl apply -f k8s-manifests/k8s-deployment.yaml
    ```
4.  **Access the Application**: Find the public DNS name of the Application Load Balancer by checking the Ingress resource:
    ```
    kubectl get ingress ecommerce-ingress -n ecommerce
    ```

## 7. Observability

The structured JSON logs are designed to be collected by a log forwarder like **Fluent Bit** in a Kubernetes environment. Fluent Bit can then forward these logs to a centralized platform like **Amazon CloudWatch Logs**, enabling powerful querying, analysis, and alerting.


---

# Welcome to My AWS 3-Tier Application Demo

Hello, everyone! My name is **Mfon Etuk**. You are probably asking what is this **Security Engineer** doing teaching this! "In order to secure it, you must understand it!"

  This repository is all about **teaching** how to build, deploy, and manage a **3-tier application** on AWS. I’ll walk you through each step so you can gain practical cloud experience—while also demonstrating my personal workflow and best practices for potential employers.

---

## Table of Contents

1. [Why This Project?](#why-this-project)  
2. [Who Is This For?](#who-is-this-for)  
3. [Architecture at a Glance](#architecture-at-a-glance)  
4. [AWS Services Used](#aws-services-used)  
5. [Cost-Friendly Approach](#cost-friendly-approach)  
6. [How to Reproduce This Setup](#how-to-reproduce-this-setup)  
7. [App Contents](#app-contents)  
8. [License](#license)

---

## Why This Project?

1. **Teach & Learn**: I want to show fellow developers and students the **hands-on** approach to AWS. There’s no better way to learn than actually **deploying** something.
2. **Demonstrate My Process**: Potential employers can see exactly how I approach infrastructure design, cost management, and DevOps practices.

---

## Who Is This For?

- **Aspiring Cloud Engineers or DevOps Beginners**: If you’ve never touched AWS, this is a great step-by-step intro.
- **Developers Wanting a Hands-On Lab**: Learn ECS, ALB, RDS, and ECR by doing.
- **Employers & Recruiters**: Check out my documentation style and see how I teach these concepts.

---

## Architecture at a Glance

A classic **3-tier** setup:

1. **Presentation Tier**: A static site or minimal web server (my personal page) running in a **container**.
2. **Application / API Tier**: (Optional) If you want an API in another container, you can do that, too, on ECS.
3. **Database Tier**: Hosted on **Amazon RDS** (MySQL) to store any dynamic data you might need.

---

## AWS Services Used

- **Amazon ECS (Fargate)**: Orchestrates and runs our Docker containers without managing servers.  
- **Amazon ECR (Elastic Container Registry)**: Securely stores our Docker images.  
- **Application Load Balancer (ALB)**: Distributes incoming traffic to ECS tasks.  
- **Amazon RDS**: Hosts our database in a scalable, managed way.  
- **Amazon VPC**: Provides our own network environment (subnets, route tables, security groups).  

---

## Cost-Friendly Approach

I designed this project to stay around **\$50/month** or less, depending on usage:

1. **Minimal Fargate Task**: 0.25 vCPU, 0.5 GB memory—just enough for a personal site.  
2. **One ALB**: Generally \$15–\$20/month.  
3. **Small RDS Instance**: A `db.t2.micro` or `db.t3.micro` if you have free tier or about \$15–\$20 if not.  
4. **No NAT Gateway**: Placing ECS tasks in a public subnet with correct security group rules to save on NAT costs. 
**(My friend asked me about this haha)**

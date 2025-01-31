
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

---

## How to Reproduce This Setup (Detailed Steps)

Below is a **step-by-step guide**. Even if you’re brand new to AWS, follow along carefully, and you’ll get the full environment running.

### 5.1 Prerequisites

- An **AWS Account**.  
- **Docker** installed locally for building images.  
- (Optional) **AWS CLI** installed and configured (makes some steps easier).

### 5.2 Create or Verify IAM User


1. **Create a new user** (e.g., `admin-user`) with **AdministratorAccess**.  
2. **Log out** of the root account, then **log in** with your new `admin-user`.  
3. (Optional) **Set up AWS CLI** with `aws configure` using this user’s Access Key/Secret Key.

> **Best Practice**: Avoid using the root account beyond initial setup. The new admin user is for daily tasks.

### 5.3 Create (or Use) a VPC and Subnets

1. **Check Default VPC**: In many AWS regions, there’s a default VPC with subnets you can use.  
2. If you want to **create a custom VPC**: 
   1. Click **Create VPC** → **VPC only** → give it a name (`my-3tier-vpc`) → CIDR ( `10.0.0.0/16`).  
   2. **Subnets**: create 1 or 2 public subnets with smaller CIDRs (`10.0.1.0/24`, `10.0.2.0/24`).  
   3. **Attach an Internet Gateway** to your VPC, then edit the route table for the public subnets to allow `0.0.0.0/0` to IGW.

For a quick demo, you can **skip** NAT Gateways, and just place ECS tasks in public subnets.

### 5.4 Set Up Security Groups

We need at least 3 security groups:

1. **ALB Security Group** ( `sg-alb`):
   - Inbound: HTTP (port 80) from `0.0.0.0/0`.
   - Outbound: all traffic (default).
2. **ECS Security Group** ( `sg-ecs`):
   - Inbound: allow **All TCP** (or port 80) from `sg-alb`.
   - Outbound: all traffic (default).
3. **RDS Security Group** (e.g. `sg-rds`): *(Only if using RDS)*
   - Inbound: MySQL (3306) or PostgreSQL (5432) from `sg-ecs`.
   - Outbound: all traffic (default).

Ensure **all these SGs** are in the **same VPC**. If you get an error about “different networks,” you might have selected a different VPC for one.

### 5.5 Docker Image & Amazon ECR

1. **Build Your Image Locally**:
   1. Create a folder: `my-personal-site/`.  
   2. Add a `Dockerfile` that sets up a simple web server (Node, Python, Nginx—your preference).  
   3. Add your `index.html` or site files with your picture, name, and links.  
   4. Run `docker build -t my-personal-site .`.
2. **Push to ECR**:
     
   1. Create a **New Repository** (call it `my-personal-site`).  
   2. Follow the “View Push Commands” to log in and push your image:
      ```bash
      aws ecr get-login-password --region us-east-1 | \
         docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
      docker tag my-personal-site:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/my-personal-site:latest
      docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/my-personal-site:latest
      ```
   4. Now your image is in ECR, ready for ECS to pull.

### 5.6 Create an ECS (Fargate) Cluster & Service

1. **Cluster**:
   1. Go to ECS console  
   2. Click **Clusters** → **Create Cluster** → **Networking Only** (Fargate).  
   3. Name it `my-ecs-cluster`.
2. **Task Definition**:
   1. Left menu → **Task Definitions** → **Create New Task Definition**.  
   2. Launch type: **Fargate**.  
   3. Name: `my-personal-site-task`.  
   4. CPU/memory: pick the smallest (0.25 vCPU, 0.5GB).  
   5. **Container**:
      - Container name: `my-personal-site`.
      - Image: `<YOUR_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/my-personal-site:latest`.
      - Port mappings: (container port) `80` → protocol `TCP`.  
   6. Create the task definition.
3. **Service**:
   1. In ECS → **Clusters** → choose `my-ecs-cluster` → **Create** (Service).  
   2. Launch type: **Fargate**.  
   3. Task Definition: select `my-personal-site-task`.  
   4. Service name: `my-personal-site-service`.  
   5. Desired tasks: 1 (we just need one to keep costs low).  
   6. VPC: select your VPC (the same as the security groups).  
   7. Subnets: choose your **public** subnets (so tasks can get a public IP).  
   8. Security Group: choose `sg-ecs`.  
   9. Enable **Auto-assign public IP**: yes.  
   10. (We’ll attach the load balancer in the next step.)

### 5.7 Set Up an Application Load Balancer

1. **Create ALB**:
   1. Go to EC2 console → **Load Balancers** → **Create Load Balancer** → **Application Load Balancer**.  
   2. Name: `my-alb`.  
   3. Scheme: **internet-facing**, IP type: IPv4.  
   4. Listener: HTTP on port 80.  
   5. Select your **public** subnets.  
   6. Security group: `sg-alb`.
2. **Target Group**:
   - You can create a new target group (type: `IP`) for your ECS tasks.  
   - Name it `tg-personal-site`.  
   - Protocol: HTTP, Port: 80.
3. **Attach ALB to ECS Service**:
   1. In ECS → your service → **Edit** (or “Update Service”).  
   2. Under **Load balancing**, choose **Application Load Balancer**.  
   3. Production listener port: `80`.  
   4. Select `tg-personal-site` as the target group.  
   5. Set health check grace period to 30 seconds.  
   6. Complete the update—ECS will register the tasks to the ALB.

### 5.8 Create an RDS Database

*(Skip this if you don’t need a database for your personal page.)*

1. Go to the **RDS console**
2. **Create database**:  
   - Engine: MySQL or PostgreSQL.  
   - Choose free tier if you qualify.  
   - DB instance: `db.t3.micro` or `db.t2.micro`.  
   - Name: `my-rds`.  
   - Credentials: username/password (e.g., `admin` / `MyPassword123`).  
   - VPC: same as ECS.  
   - Subnets: typically pick a subnet group that includes private subnets (or public for quick testing).  
   - **Security group**: `sg-rds`.  
3. Wait for the status to become **Available**.  
4. Note the **Endpoint** (e.g., `my-rds.xxxxx.us-east-1.rds.amazonaws.com`)—you’ll need this if your app connects to the DB.

### 5.9 Connect ECS to RDS (Optional)

1. **Edit Task Definition**:
   1. Add environment variables for DB connection:  
      - `DB_HOST=my-rds.xxxxx.us-east-1.rds.amazonaws.com`  
      - `DB_USER=admin`  
      - `DB_PASS=MyPassword123`  
      - `DB_NAME=whatever_your_db_is_named`  
2. **In your app code**, connect using these env variables. Example (Python + `pymysql`):
   ```python
   import os
   import pymysql

   db_host = os.getenv('DB_HOST')
   db_user = os.getenv('DB_USER')
   db_pass = os.getenv('DB_PASS')
   db_name = os.getenv('DB_NAME')

   connection = pymysql.connect(host=db_host,
                                user=db_user,
                                password=db_pass,
                                db=db_name)
   # ...
   ```
3. Make sure your RDS security group (`sg-rds`) allows inbound from `sg-ecs`.

### 5.10 Test Your Setup

1. Go to **EC2 → Load Balancers** → select `my-alb` → **Description** tab.  
2. Copy the **DNS name** (e.g., `my-alb-123456.us-east-1.elb.amazonaws.com`).  
3. Open it in your browser: `http://my-alb-123456.us-east-1.elb.amazonaws.com`.  
4. You should see your personal page 
---

## App Contents

- **`app/`**: Contains the Dockerfile, HTML/CSS/JS, or Python/Node server code that runs your personal site.  
- **`infra/`** : This will contain the terraform code for this project, **soon to come**. I will also make a seperate project for this 


---

## License

This project is open-source under the [MIT License](./LICENSE). Feel free to fork it, adapt it, or share with others learning AWS.

---

# Thank You & Happy Learning!

I hope you find this **3-tier AWS guide** useful. It’s a fun way to **build your own personal site** and simultaneously learn how to manage containers, load balancers, and databases in AWS. 

If you have questions, open an issue or reach out on [LinkedIn](www.linkedin.com/in/mfon-etuk-8a9068b1). Let’s keep learning together!

  
**CloudwithMazi**  

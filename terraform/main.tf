terraform {
  required_providers {
    kubernetes = {
      source = "hashicorp/kubernetes"
      version = "2.36.0"
    }
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

# Backend Deployment
resource "kubernetes_deployment" "backend" {
  metadata { name = "backend" }
  spec {
    selector { match_labels = { app = "backend" } }
    template {
      metadata { labels = { app = "backend" } }
      spec {
        container {
          name  = "backend"
          image = "backend:latest"
          image_pull_policy = "Never"
          port { container_port = 3000 }
        }
      }
    }
  }
}

# Frontend Deployment
resource "kubernetes_deployment" "frontend" {
  metadata { name = "frontend" }
  spec {
    selector { match_labels = { app = "frontend" } }
    template {
      metadata { labels = { app = "frontend" } }
      spec {
        container {
          name  = "frontend"
          image = "frontend:latest"
          image_pull_policy = "Never"
          port { container_port = 80 }
        }
      }
    }
  }
}

# Services
resource "kubernetes_service" "backend" {
  metadata { name = "backend-service" }
  spec {
    selector = { app = "backend" }
    port { port = 3000 }
    type = "ClusterIP"
  }
}

resource "kubernetes_service" "frontend" {
  metadata { name = "frontend-service" }
  spec {
    selector = { app = "frontend" }
    port { port = 80 }
    type = "LoadBalancer"
  }
}
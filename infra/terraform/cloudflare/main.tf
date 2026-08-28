terraform {
  required_version = ">= 1.6"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

variable "cloudflare_api_token" {
  description = "The Cloudflare API Token"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "The Cloudflare Account ID"
  type        = string
}

variable "project_name" {
  description = "The Cloudflare Pages project name"
  type        = string
  default     = "front-tenteador"
}

resource "cloudflare_pages_project" "pages_project" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = "main"
}
## Infrastructure-as-Code Template Documentation

This document provides documentation for the CloudFormation template (`ec2_cloudformation.yml`) used to provision an EC2 instance.

### Template Overview

The `ec2_cloudformation.yml` template defines the following resources:

*   **EC2Instance:** An EC2 instance with PM2 and CI/CD configurations.
*   **InstanceSecurityGroup:** A security group for the EC2 instance, allowing SSH access.

### Resources

#### 1. EC2Instance

This resource defines the EC2 instance.

*   **Type:** `AWS::EC2::Instance`
*   **Properties:**
    *   `ImageId`: The ID of the AMI to use for the EC2 instance.
        *   Example: `"ami-0c55b985cb0c039a9"` (Basic Ubuntu AMI)
    *   `InstanceType`: The instance type to use for the EC2 instance.
        *   Example: `"t2.micro"`
    *   `KeyName`: The name of the key pair to use for SSH access.
        *   Example: `"your-key-pair"` (Replace with your key pair name)
    *   `SecurityGroups`: The security groups to associate with the EC2 instance.
        *   Value: `!Ref 'InstanceSecurityGroup'`
    *   `UserData`: The user data to execute when the EC2 instance is launched.
        *   Example:
            ```yaml
            UserData:
              Fn::Base64: |
                #!/bin/bash
                apt-get update -y
                apt-get install -y nodejs npm
                npm install -g pm2
                # CI/CD configurations (example)
                apt-get install -y git
                # Add your CI/CD script here
            ```

#### 2. InstanceSecurityGroup

This resource defines the security group for the EC2 instance.

*   **Type:** `AWS::EC2::SecurityGroup`
*   **Properties:**
    *   `GroupName`: The name of the security group.
        *   Value: `"instance-security-group"`
    *   `GroupDescription`: A description of the security group.
        *   Value: `"Enable SSH access via port 22"`
    *   `SecurityGroupIngress`: The inbound rules for the security group.
        *   Example:
            ```yaml
            SecurityGroupIngress:
              - IpProtocol: tcp
                FromPort: 22
                ToPort: 22
                CidrIp: 45.121.88.211/32
            ```

### Outputs

The template defines the following outputs:

*   **InstancePublicIp:** The public IP address of the EC2 instance.
    *   Description: `"The public IP of the EC2 instance"`
    *   Value: `!GetAtt EC2Instance.PublicIp`

### CI/CD Configurations

The `UserData` section includes example CI/CD configurations. You can customize this section to include your specific CI/CD scripts.

**Note:** I still need the AWS region (e.g., us-east-1) and output format (e.g., json) to configure the AWS CLI and deploy the CloudFormation template....

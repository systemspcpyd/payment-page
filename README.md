```mermaid
graph LR
    %% Main Entry
    URL --> Index["index.html"]
    
    %% Navigation
    Index --> MPI["index-mpi-non-hosted.html"]
    Index --> PAG_Non["index-pag-non-hosted.html"]
    Index --> PAG_Hosted["pag-hosted.html"]
    Index --> Dummy["mpigwv2.html"]
    
    %% Gateway Targets
    Target1["devlink.paydee.co/mpi"]
    Target2["devlinkv2.paydee.co/mpigw"]
    Target3["devlinkv2.paydee.co/mpigwv2"]
    
    %% Branching Logic
    MPI --> Target1
    PAG_Non --> Target2
    PAG_Hosted --> Target2
    Dummy --> Target3
    
    %% Unified Callback Flow
    Target1 --> Callback["payment-page-virid.vercel.app/api/callback"]
    Target2 --> Callback
    Target3 --> Callback
    
    Callback --> API_JS["/api/callback.js"]
    
    %% Logic Processing
    API_JS --> IfPOST{"if POST"}
    IfPOST --> R1["/redirect-01.html"]
    IfPOST --> R2["/redirect-02.html"]
    IfPOST --> Status["/payment-status.html"]
    
    API_JS --> IfGET{"if GET"}
    IfGET --> StatusQuery["/payment-status.html?queryParams"]

    %% Dark Blue Styling
    style Target1 fill:#00008B,stroke:#fff,color:#fff
    style Target2 fill:#00008B,stroke:#fff,color:#fff
    style Target3 fill:#00008B,stroke:#fff,color:#fff

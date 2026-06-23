```mermaid
graph LR
    %% Entry Point
    URL --> Index[index.html]
    
    %% Navigation
    Index --> MPI[index-mpi-non-hosted.html]
    Index --> PAG_Non[index-pag-non-hosted.html]
    Index --> PAG_Hosted[pag-hosted.html]
    Index --> Dummy[mpigwv2.html]
    
    %% MPI Path
    MPI --> MPI_L[left: mpi-non-hosted.html]
    MPI_L --> Target1[devlink.paydee.co/mpi]
    Target1 --> MPI_QR{MPI_QR_CODE}
    MPI_QR --> Redirect03[/form/redirect/redirect-03.html]
    Target1 --> MPI_Redirect{MPI_REDIRECT_URL/DATA}
    MPI_Redirect --> Redirect01[/form/redirect/redirect-01.html]
    MPI_Redirect --> Redirect02[/form/redirect/redirect-02.html]
    
    %% PAG Path
    PAG_Non --> PAG_L[left: pag-channel.html]
    PAG_Non --> PAG_R[right: pag-payment.html]
    PAG_L --> Target2[devlinkv2.paydee.co/mpigw]
    PAG_R --> Target2
    PAG_Hosted --> Target2
    
    %% Callback Logic
    Target2 --> Callback[payment-page-virid.vercel.app/api/callback]
    Callback --> API_JS[api/callback.js]
    
    API_JS --> IfPOST{if POST}
    IfPOST --> Redirect01
    IfPOST --> Redirect02
    IfPOST --> StatusElse[/payment-status.html]
    
    API_JS --> IfGET{if GET}
    IfGET --> StatusGet[/payment-status.html?queryParams]

    %% Dummy Path
    Dummy --> Target3[devlinkv2.paydee.co/mpigwv2]

    %% Styling
    style Target1 fill:#00008B,stroke:#fff,color:#fff
    style Target2 fill:#00008B,stroke:#fff,color:#fff
    style Target3 fill:#00008B,stroke:#fff,color:#fff

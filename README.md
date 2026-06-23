```mermaid
graph LR
    %% Main Entry
    URL --> Index[index.html]
    
    %% Navigation Layer
    Index --> MPI[index-mpi-non-hosted.html]
    Index --> PAG_Non[index-pag-non-hosted.html]
    Index --> PAG_Hosted[pag-hosted.html]
    Index --> Dummy[mpigwv2.html]
    
    %% Iframe Logic
    MPI --> MPI_L[left: mpi-non-hosted.html]
    MPI --> MPI_R[right: test-card.html]
    PAG_Non --> PAG_L[left: pag-channel.html]
    PAG_Non --> PAG_R[right: pag-payment.html]
    
    %% Target Alignment Layer
    subgraph Targets [Payment Gateways]
        direction LR
        Target1[devlink.paydee.co/mpi]
        Target2[devlinkv2.paydee.co/mpigw]
        Target3[devlinkv2.paydee.co/mpigwv2]
    end
    
    %% Connecting to Targets
    MPI_L --> Target1
    PAG_L --> Target2
    PAG_R --> Target2
    PAG_Hosted --> Target2
    Dummy --> Target3

    %% Dark Blue Styling
    style Target1 fill:#00008B,stroke:#fff,color:#fff
    style Target2 fill:#00008B,stroke:#fff,color:#fff
    style Target3 fill:#00008B,stroke:#fff,color:#fff

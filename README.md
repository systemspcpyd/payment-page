```mermaid
graph LR
    %% Main Entry Point
    URL --> Index[index.html]
    
    %% Navigation Layer (Aligned)
    subgraph Navigation_Options [Navigation Pages]
        direction TB
        MPI[index-mpi-non-hosted.html]
        PAG_Non[index-pag-non-hosted.html]
        PAG_Hosted[pag-hosted.html]
        Dummy[mpigwv2.html]
    end
    
    Index --> MPI
    Index --> PAG_Non
    Index --> PAG_Hosted
    Index --> Dummy
    
    %% Flows
    MPI --> MPI_Left[left: mpi-non-hosted.html]
    MPI --> MPI_Right[right: test-card.html]
    MPI_Left --> Target1[devlink.paydee.co/mpi]
    
    PAG_Non --> PAG_Left[left: pag-channel.html]
    PAG_Non --> PAG_Right[right: pag-payment.html]
    PAG_Left --> Target2[devlinkv2.paydee.co/mpigw]
    PAG_Right --> Target2
    
    PAG_Hosted --> Target2
    
    Dummy --> Target3[devlinkv2.paydee.co/mpigwv2]

    %% Styles
    style Target1 fill:#00008B,stroke:#fff,color:#fff
    style Target2 fill:#00008B,stroke:#fff,color:#fff
    style Target3 fill:#00008B,stroke:#fff,color:#fff

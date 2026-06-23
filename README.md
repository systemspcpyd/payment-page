```mermaid
graph LR
    %% Main Entry
    URL --> Index[index.html]
    
    %% Navigation Row
    Index --> MPI[index-mpi-non-hosted.html]
    Index --> PAG_Non[index-pag-non-hosted.html]
    Index --> PAG_Hosted[pag-hosted.html]
    Index --> Dummy[mpigwv2.html]
    
    %% Intermediate Steps
    MPI --> MPI_Left[left: mpi-non-hosted.html]
    MPI --> MPI_Right[right: test-card.html]
    PAG_Non --> PAG_Left[left: pag-channel.html]
    PAG_Non --> PAG_Right[right: pag-payment.html]
    
    %% Aligning Targets
    MPI_Left --> Target1[devlink.paydee.co/mpi]
    PAG_Left --> Target2[devlinkv2.paydee.co/mpigw]
    PAG_Right --> Target2
    PAG_Hosted --> Target2
    Dummy --> Target3[devlinkv2.paydee.co/mpigwv2]

    %% Force alignment of targets
    linkStyle 8,9,10,11,12 stroke-width:0px;
    
    %% Styles
    style Target1 fill:#00008B,stroke:#fff,color:#fff
    style Target2 fill:#00008B,stroke:#fff,color:#fff
    style Target3 fill:#00008B,stroke:#fff,color:#fff

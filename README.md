```mermaid
graph LR
    URL --> Index[index.html]
    
    Index --> MPI[index-mpi-non-hosted.html]
    MPI --> MPI_Left[left: mpi-non-hosted.html]
    MPI --> MPI_Right[right: test-card.html]
    MPI_Left --> Target1[devlink.paydee.co/mpi]
    
    Index --> PAG_Non[index-pag-non-hosted.html]
    PAG_Non --> PAG_Left[left: pag-channel.html]
    PAG_Non --> PAG_Right[right: pag-payment.html]
    PAG_Left --> Target2[devlinkv2.paydee.co/mpigw]
    PAG_Right --> Target2
    
    Index --> PAG_Hosted[pag-hosted.html]
    PAG_Hosted --> Target2
    
    Index --> Dummy[mpigwv2.html]
    Dummy --> Target3[devlinkv2.paydee.co/mpigwv2]

    %% Styling all targets to dark blue
    style Target1 fill:#00008B,stroke:#fff,color:#fff
    style Target2 fill:#00008B,stroke:#fff,color:#fff
    style Target3 fill:#00008B,stroke:#fff,color:#fff

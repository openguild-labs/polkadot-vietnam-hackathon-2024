# Veles
The Veles pallet is a plug and play carbon credit marketplace solution for Substrate based blockchain networks. Veles enables its user to freely and seamlessly monitor, mint, transact and retire carbon credits. Apart from the main marketplace features, Veles also provides a solution to regulate malicious behaviors within the marketplace and to mitigate the impacts of such behaviors.
<br />

## Veles documentation
If you would like to find out more on how the pallet works and what features does it have please look at our official [Gitbook](https://app.gitbook.com/o/WABjLs5AlKX6VnOwtcI4/s/bTNhSGh61JAMglLLtG8x/get-started/what-is-the-veles-pallet) for the project.
<br />

## Pallet structure
If you would like to find out what data structures exist on the pallet and how they are connected please have a look at the [provided diagrams](https://drive.google.com/file/d/1Iq0n3RrZHUGftbolThfKSwm4ME6Qs5fP/view?usp=sharing).
<br />

## Deployment
### Prerequirments
Before we can deploy the pallet onto a local blockchain for testing please make sure that you have all of the required resources set up on your machine. Follow the [official Substrate documentation](https://docs.substrate.io/install/) to confirm that you have everything up and running.
<br />

### Pallet configuration
After you have cloned the repository to you local machine, please make sure that you have configured the pallet to your desired specifications. You can do so by editing the ```parameter_types!``` for the pallet (i.e. the IPFSLength and BlockFinalizationTime values). Make sure that you have also set up your blockchain to run offchain workers (the OffchainWorkerTxPriority and OffchainWorkerTxLongevity values). If you would like to add an authority account or any other account to the pallet, please feel free to do so in the pallets ```lib.rs``` file.
<br />

### Pallet deployment
Once you have set up the pallet and local network please run the ```cargo run --release -- --dev``` to build the network and run it locally (note: the network will start on 127.0.0.1:9944).
You can then interact with the network and Veles pallet through the [PolkadotJS Explorer](https://polkadot.js.org/apps/#/explorer)

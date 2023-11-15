-----
title: Gas-free transactions on NEAR Protocol
cover: https://cdn-images-1.medium.com/max/5760/1*Tv5Iw-O9Xv6s1egcBja08w.jpeg
tag: near
text: Gas fees represent the charge that users must pay for processing their transactions on the blockchain. But what if there was a way to do transactions without paying for gas?
timeToRead: 4 min
date: 03.07.2023
-----


When we discuss blockchain technology, one of the key questions that always arises for users is the issue of transaction fees, or as they are often referred to in the cryptocurrency ecosystem — “gas”. Gas fees represent the charge that users must pay for processing their transactions on the blockchain. But what if there was a way to do transactions without paying for gas?

In the spring of 2023, the NEAR Protocol team introduced a significant update, *nearcore* 0.17, which included support for meta-transactions. This was a huge breakthrough in lowering barriers for new users, as meta-transactions allow third parties to pay for transaction costs for any account. This means that users can start using NEAR applications without first owning NEAR tokens.

![](https://cdn-images-1.medium.com/max/5760/1*Tv5Iw-O9Xv6s1egcBja08w.jpeg)

### Technology Overview

Meta-transactions are based on the concept of “gas forwarding”. Instead of each user paying for the gas of their transaction, these costs can be shifted to a third party. In the case of NEAR, this role is played by HERE Wallet (HERE RPC). It automatically processes and pays for the user’s gas expenses.

When a user initiates a transaction, instead of interacting directly with the blockchain, they create a signature for their transaction. This signature is then sent to the HERE RPC, which takes on the gas costs, initiating the transaction in the blockchain on behalf of the user.

### Security

As meta-transactions are a relatively new concept in the field of blockchain, questions about security naturally arise. However, it’s important to understand that when using meta-transactions, the user still controls their keys and initiates transactions independently. HERE RPC simply performs the role of paying for the gas.

In addition, even though HERE RPC pays for gas, it cannot under any circumstances influence the content of the transaction. It cannot alter data or the direction of the transaction, and it also cannot initiate transactions on behalf of the user without their permission. This ensures that, despite the convenience offered by meta-transactions, the user’s security remains paramount.

### Why is this Important?

1. **Ease of entry for new users:** New users interested in using blockchain applications often face the hurdle of needing to purchase cryptocurrency to pay for gas. Meta-transactions bypass this obstacle, allowing new users to start working with NEAR applications without an initial purchase of NEAR tokens.

1. **Simplification of the user experience**: Paying for gas can be complicated for unprepared users, especially if the cost of gas fluctuates. HERE Wallet simplifies this process by automatically paying for the gas on behalf of the user.

1. **Support for economic inclusion: **Some users may experience difficulties in acquiring cryptocurrency due to geographical or economic barriers.

**Autor**: [Petr Volnov](https://twitter.com/p_volnov)

**HERE Wallet:** [Google Play / App Store](http://download.herewallet.app/medium)

Join our community:
> [**Discord**](https://discord.gg/AfB5cvtFXH)
> [**Twitter**](https://twitter.com/here_wallet)
> [**Telegram**](https://t.me/herewallet)
> [**Telegram chat**](https://t.me/herewalletchat)
> [**Medium**](https://medium.com/@nearhere)

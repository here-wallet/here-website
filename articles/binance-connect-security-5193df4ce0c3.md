-----
title: Binance connect. Security. 🔒
cover: https://s3-alpha-sig.figma.com/img/0621/b14e/aff224c66201cdc82399220101822a37?Expires=1690761600&Signature=E3tfvM~gABb79iiYRqLsMsoDJ1gBRLSf0jlyoRZfaAhm2ChIQNPeRZzeC1t7Vblsxi0ZpqNh-J0svGgc9DJH~3FlvEC-IK8QFxTu8BcsWw4KpXp0tnDD2F6SvLO-c2b2MlQnNzRl93GBvt~VjIotku8b64eqbO6B2bIR88KKsaUo64RZrhlbZa~gtIid2hrQxxTMfcKgkvwDfxscqMs~AGUsUdERTz2fxnU5GJoJ7XnaPWgTEuI7VzAVTMhfqUGMrmJPmZKEY4LBfNTnUvSy9iJE6lPfUQ35VAo3m-mMlc74qYwl3edOthj~ehqgTHZ96~fcvGIiZxf9k~qdcjLBwA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4
tag: Tutorials
text: To move funds between Binance and crypto wallet uses ...
timeToRead: 14
date: June 28, 2023
-----


# Binance connect. Security. 🔒

Intro

To move funds between Binance and crypto wallet uses [API key](https://www.binance.com/en/blog/community/how-to-use-an-api-key-securely-5-tips-from-binance-8638066848800196896#:~:text=API%20keys%20enable%20users%20to,on%20behalf%20of%20the%20user.), which the user creates during connection.
To prevent loss or freezing funds we take a lot of security measures. In this article, will discuss the main of them.

![](https://cdn-images-1.medium.com/max/7680/1*9ZHsW37urweu-Y-2A8iyDg.jpeg)

### 📦 Keys storing

The first level of security is an API key storage. It never transferred to a backend and is only stored on the phone. On iPhones, API key is stored in [Apple keychain](https://support.apple.com/en-us/HT204085) — safe storage which has never been hacked, even on stolen iPhones.

### ☑️ White list of addresses

With API key you can transfer money only between Binance and your crypto wallet. If the key is lost but you keep [seed phrase](https://worldcoin.org/articles/what-is-seed-phrase) safe, an intruder will only be able to transfer money between your accounts, but won’t be able to withdraw it.

### 📨 Proxy server

All requests to Binance could pass only from one IP address — via HERE proxy server. Requests can’t be changed as they are signed with a secret API key which is stored locally on the phone.

However, as the requests can come only from one IP address, we can skip a request if it looks suspicious to us. Our proxy server monitors daily limits and does not let suspicious transactions through.

### 👨‍💻 Team

HERE is a US company that is subject to regulation. Any breach of the user agreement or exposure of user funds will result in serious consequences for the team. We are reassured on all counts and designed the product so as not to touch users’ money in any way. All updates are reviewed by our CTO and we go through security [*audits](https://docs.herewallet.app/technology-description/readme/security-audit)* as the project evolves.

This is only part of the security measures we take, but the most important thing you can do is to** keep the [seed phrase](https://worldcoin.org/articles/what-is-seed-phrase) safe**. We take care of the rest 🤝

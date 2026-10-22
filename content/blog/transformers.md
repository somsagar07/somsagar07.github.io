---
title: "Transformers"
date: "2024-09-05"
category: "Learning"
tags: ["Deep Learning", "LLMs"]
description: "This blog discusses the transformer architecture and its significance in deep learning."
source: "https://www.notion.so/1358157ad43a808eae4deb0a3bc04464"
---

## Introduction

The transformer architecture has transformed the landscape of deep learning, particularly in fields like natural language processing (NLP) and computer vision. Transformers departed from the traditional recurrent neural networks (RNNs) by using a unique “self-attention."  This innovation allows transformers to process data in parallel, rather than sequentially, which made models faster and more scalable. Today, they power some of the most popular language models, like BERT and GPT, redefining what’s possible in machine understanding and generation tasks.

> Unlike RNNs, which process one word or token at a time, transformers look at the entire input simultaneously. This is made possible through the self-attention mechanism, which assigns importance weights to each token based on its relationship with other tokens. This mechanism allows transformers to "attend" to relevant parts of the input, irrespective of their position, making them well-suited for understanding context and long-range dependencies in language.

<figure>
  <img src="/blog/assets/images/transformers-01.png" alt="The encoder-decoder Transformer architecture from Attention Is All You Need by Vaswani and colleagues." width="480" loading="lazy" decoding="async">
  <figcaption>Figure 1: Transformers Architecture From ‘Attention Is All You Need’ by Vaswani et al.</figcaption>
</figure>

Fig 1 shows the Transformer model architecture, illustrating the encoder-decoder structure commonly used in NLP tasks. 

## Encoder (Left Side)

The encoder consists of a stack of layers, where each layer has two main components:

- **Multi-Head Attention:** This layer allows the encoder to focus on different parts of the input sequence by learning multiple attention scores. It applies attention mechanisms in parallel (multiple heads), allowing it to capture various relationships in the input.

- **Feed Forward Layer:** A fully connected neural network applied to each position in the sequence independently, adding a non-linearity to the output.

Each of these sub-layers is followed by an **Add &amp; Norm** operation, which consists of residual connections (adding the input to the output of the layer) and layer normalization. This helps stabilize and speed up training.

## Decoder (Right Side)

The decoder has a similar structure but includes an additional layer to process the encoder's output.

- **Masked Multi-Head Attention:** The first attention layer in the decoder is masked so that each position can only attend to previous positions, preserving the autoregressive property (i.e., generating tokens one step at a time).

- **Multi-Head Attention with Encoder Outputs:** The decoder has a second attention layer, where it attends to the encoder’s output. This allows the decoder to use information from the input sequence, essential for tasks like translation.

- **Feed Forward Layer:** Similar to the encoder, this layer adds a fully connected network for additional non-linearity.

Each of these sub-layers also has **Add &amp; Norm** operations for residual connections and layer normalization.

> Positional Encoding: Transformers don’t have an inherent notion of sequence order, so positional encoding is added to each input embedding to give the model a sense of token positions.

## Output Layer

The final layer transforms the decoder's output into probabilities for each token using a Linear layer followed by a Softmax. This generates output probabilities, allowing the model to predict the most likely next word or token in a sequence.

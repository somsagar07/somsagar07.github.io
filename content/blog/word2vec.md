---
title: "Word2Vec"
date: "2024-09-10"
category: "Learning"
tags: ["Foundations", "Deep Learning"]
description: "This blog explains a method to represent words as vectors."
source: "https://www.notion.so/1398157ad43a8059b2e8fa856249a566"
---

Word2Vec is a popular `word embedding technique` developed by Google that captures the semantic meaning of words in a vector format. It transforms words into `continuous-valued vectors`, with each <u>vector's dimensions encoding various features of word meanings</u>. The main idea behind Word2Vec is <u>to represent similar words in similar ways so that they appear close together in vector space.</u>

## Model Architecture

Word2Vec has two main architecture:

- Skip-gram: The model predicts the context words given a target word.

- Continous bag of words (CBOW): This model does the opposite it predicts the target word based on the surrounding context words.

## Training process

Word2Vec learns by maximizing the likelihood of observing a context word given a target word (Skip-gram) or observing a target word given context words (CBOW). The training is achieved using neural networks, typically with just one hidden layer.

### Model Architecture

The Word2Vec neural network consists of:

1. Input layer: This layer is a one-hot encoded vector representing the target word.

1. Hidden layer: A dense layer with no activation function, where the weights represent the word embeddings we aim to learn.

1. Output layer: A layer that outputs probabilities for each word in the vocabulary (the likelihood of each word being a context word).

### Training Process

- **Skip-gram**: For each word in a sentence, the model tries to predict the surrounding words within a certain window size. For example, with the sentence “the king sits on the throne,” if the target word is "king" and the window size is 2, then the model will attempt to predict "the" and "sits" as context words.

- **CBOW**: The model takes the context words within a window around the target word and tries to predict the target word itself. Using the same sentence and a window size of 2, if we target "king," the model will use "the" and "sits" as inputs to predict "king."

### Loss

The model uses a loss function based on the probabilities of the context words, typically a cross-entropy loss. For Skip-gram, this is:

$$
Loss= -\sum logP(c|target\ word)
$$

here P(c| target word) is the probability of the context word c given the target word.

### Negative Sampling

To make the training faster and more efficient, Word2Vec often uses a method called *negative sampling*. Instead of updating the weights of all the words in the vocabulary, the model only updates the weights of a few randomly selected “negative” words that didn’t appear in the context.

- Instead of calculating and updating weights for all words in the vocabulary, the model only updates for a few randomly chosen “negative” words that do not appear in the context of the target word.

- This reduces computation by focusing on distinguishing actual context words from randomly chosen, unrelated words.

### Training Steps

For each target word in a corpus:

- Select context words within the defined window.

- Input the target word (one-hot encoded) into the neural network.

- Calculate the probabilities of context words at the output layer.

- Use negative sampling to update the weights only for the positive (true context) and a few negative (randomly chosen unrelated) words.

- Adjust the weights in the hidden layer based on the error to minimize the loss.

- These steps are repeated for all words in the corpus across multiple epochs.

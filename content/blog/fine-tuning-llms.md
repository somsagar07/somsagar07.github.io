---
title: "Fine-Tuning LLMs"
date: "2024-09-03"
category: "Learning"
tags: ["Foundations", "Deep Learning", "LLMs"]
description: "This blog discusses basics of finetuning and finetuning methods in LLMs."
source: "https://www.notion.so/1368157ad43a80978022dcb2b21b77ba"
---

`Fine-tuning` is a process in machine learning where a pre-trained model is adapted to a new, specific task. Instead of training a model from scratch, which is resource-intensive, fine-tuning leverages the learned patterns from a general-purpose model and adjusts them for a narrower, more specific purpose.

## Basics of Fine-Tuning

- **Pre-Trained Models**: These models are initially trained on vast amounts of data for general purposes. For example, image models might be pre-trained on ImageNet, while language models could be trained on diverse text corpora.

- **New Task Data**: Fine-tuning requires task-specific data that might be smaller than the data used for pre-training. For example, if you want a language model to answer legal questions, you’d fine-tune it on a dataset containing legal Q&amp;A or relevant documents.

- **Adjusting Parameters**: Fine-tuning typically involves adjusting only some of the model’s layers, often the last few, to adapt the model to new patterns and associations. This process requires lower computational power than training a model from scratch.

- **Hyperparameters and Regularization**: Fine-tuning requires careful selection of hyperparameters like learning rate and may also involve techniques like dropout to prevent overfitting. Overfitting occurs when a model learns specific details of the fine-tuning data too closely, reducing its generalization ability on new data.

## Fine-Tuning in Language Models (LLMs)

Fine-tuning becomes complex yet powerful with LLMs due to the model's scale and the diversity of potential tasks (e.g., text classification, translation, question answering, etc.). 

Fine-tuning LLMs adapts them to particular styles, domains, or applications, enabling them to perform specific tasks more effectively than a general-purpose model.

### Types of Fine-Tuning

- Supervised finetuning: Directly feeding the model `task-specific pairs` (input, desired output). For example, training a language model to write customer support responses with input-output examples of customer queries and ideal responses.

- Reinforcement Learning with Human or AI feedback: This involves using `reinforcement learning`, often with `human feedback` (RLHF) or `AI feedback` (RLAIF). Human or AI evaluators rank model responses, and the model adjusts based on the `reward signal`, i**mproving performance based on quality, relevance, or specific criteria** (e.g., politeness).

- Instruction Fine-Tuning: Fine-tuning on datasets with explicit instructions to make models follow commands, beneficial for task-oriented models.

#### Parameter-Efficient Fine-Tuning

- `Adapters`: Small modules added to each layer of the model, tuned specifically to the task while keeping the main model frozen.

- `Low-Rank Adaptation` (LoRA): Reduces the number of parameters by representing weight matrices as the product of smaller matrices.

- `Prompt-Tuning`: The model remains unchanged, but specific prompts are added to the inputs, guiding the model’s response style without altering its weights.

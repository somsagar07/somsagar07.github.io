---
title: "Low-Rank Adaptation"
date: "2024-09-26"
category: "Learning"
tags: ["Foundations", "Deep Learning", "LLMs"]
description: "This blog explains a finetuning method called LoRA."
source: "https://www.notion.so/1388157ad43a801ab1fecd468b1164dc"
---

`LoRA `(Low-Rank Adaptation) is a technique designed to efficiently fine-tune large language models (LLMs) by adapting only a few key parameters, rather than updating the entire model, which is both memory-intensive and computationally costly. LoRA is particularly popular because it helps `reduce the storage and compute requirements` of adapting models, making it feasible to run and update models even on resource-constrained devices.

## Limitations of Full Fine-Tuning

- Fine-tuning generally requires you to modify all parameters, which can be very resource-intensive.

- This is inefficient because many layers in a large model have excessive parameters, and fine-tuning each one isn’t always necessary.

- As a result, fine-tuning large language models on resource-constrained devices (such as GPUs with limited memory) or for multiple tasks can become infeasible.

## Core Idea

LoRA addresses this problem by focusing on a subset of parameters in specific layers (like the attention layers in a transformer). Instead of updating the full weight matrix of a layer, LoRA introduces a low-rank decomposition, where only small matrices are learned during fine-tuning.

These small matrices add a small number of parameters to the model and are much faster and more memory-efficient to train than modifying the entire layer.

### Low-Rank Decomposition

In LoRA, each weight matrix W that we want to fine-tune is decomposed into two smaller matrices A and B such that $W'=W+\Delta W$, here $\Delta W = A.B$ and both A and B are much lower rank than W.  
This means that during training only A and B are updated, while W remains frozen. The rank of A and B is a hyperparameter in LoRA, chosen to balance between computational efficiency and model expressiveness.

#### How LoRA Adapts Weights

During fine-tuning, the product A.B represents an additive update to the original weight matrix W. Since A and B are the only matrices being trained a small portion of the models total paramets need to be updated.

### Forward Pass in LoRA

During a forward pass, the adapted weight W’ is used instead of the original W. So when the layer process an input x: 

$$
y=W'x=(W+A.B).x
$$

This output u captures the information from the original weights W while incorporating the low-rank adaptation provided by A and B.

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import get_peft_model, LoraConfig

model_name = "gpt-2"
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)


lora_config = LoraConfig(
    task_type="CAUSAL_LM", # Language model type
    r=4,                   # Low-rank dimension
    lora_alpha=16,         # Scaling factor for LoRA
    target_modules=["attn.q_proj", "attn.v_proj"], # Target layers
    lora_dropout=0.1
)


model = get_peft_model(model, lora_config)

# Your training loop here
```

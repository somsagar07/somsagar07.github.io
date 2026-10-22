---
title: "Proximal Policy Optimization"
date: "2024-09-03"
category: "Learning"
tags: ["Reinforcement Learning"]
description: "This blog details the working of PPO."
source: "https://www.notion.so/1378157ad43a805c9713d17662af18cf"
---

`Proximal Policy Optimization` (PPO) is a popular reinforcement learning algorithm, particularly known for its **efficiency, robustness, and simplicity** in `training policies` for complex tasks. It's often used in environments with `large action spaces or continuous actions`, such as robotics or game-playing.  
PPO belongs to a class of algorithms called **policy gradient methods**. These methods optimize the policy (a function that maps states to actions) directly by adjusting the parameters to maximize the expected reward.

## Policy Gradient Basics

In reinforcement learning we often seeks a policy, $\pi_\theta(a|s)$, that maximizes the expected cumulative reward. Policy gradient methods optimize this policy directly by adjusting parameters $\theta$ to maximize the objective:

$$
J(\theta)=\mathbb{E}_{\pi_\theta}[\sum_{t=0}r(s_t,a_t)]
$$

This objective is typically approximated by sampling trajectories under the policy $\pi_\theta$ and updating $\theta$ in the direction that increases the probability of actions with high returns.

A straightforward policy gradient method, like `REINFORCE`, updates the policy parameters in the direction of the gradient of expected rewards. However, this can cause:

- `High variance`: Gradient estimates can vary significantly, leading to unstable updates.

- `Large policy change`: A single gradient update can cause drastic changes to the policy, leading to erratic behavior and instability.

To address these issues, **`Trust Region Policy Optimization`** (TRPO) was developed, which constrains each policy update to a small trust region, effectively limiting how much the policy can change at each step. While TRPO works well, it requires solving a constrained optimization problem with a second-order method, which is computationally expensive.

PPO simplifies this by replacing the complex constraint in TRPO with a simpler clipping mechanism, retaining stability while improving computational efficiency.

## PPO Objective Function

PPO’s primary innovation is in its objective function. For a policy parameterized by $\theta$, the objective function is defined as:

$$
L^{PPO}(\theta)=\mathbb{E}[\min(r(\theta).A(s,a), clip(r(\theta), 1-\epsilon, 1+\epsilon).A(s,a))]
$$

where:

- $r(\theta)$: This is the probability ratio of the new policy over the old policy: $\frac{\pi_\theta(a|s)}{\pi_{\theta old}(a|s)}$. This ratio represents the relative likelihood of taking action a in state s under the new policy compared to the old policy. It captures how much the new policy deviates from the old one.

- A(s|a): The advantage function tells us whether taking action a in state s was better than the average expected action. This helps guide the policy update by assigning higher importance to actions that yield better-than-expected rewards.

- Clipping $r(\theta)$: PPO clips the probability ratio $r(\theta)$ within a range of $[1-\epsilon,1+\epsilon]$, where $\epsilon$ is a small constant often set between 0.1, 0.3. This clipping prevents $r(\theta)$ from deviating too far from 1. which limits drastic policy changes.

- Minimization with Clipped Objective: PPO takes the minimum of the unclipped and clipped objectives. This setup prevents the algorithm from maximizing the advantage indefinitely, ensuring that the policy update remains close to the original one and reduces the risk of destabilizing the policy.

### Advantage Estimation

To compute A(s,a), PPO often uses `Generalized Advantage Estimation` (GAE), which provides a trade-off between bias and variance by adjusting the parameter $\lambda$.  The advantage can be computed recursively with:

$$
A(s_t,a_t) = \delta_t+ (\gamma\lambda)\delta_{t+1}+(\gamma\lambda)^2\delta_{t+2}+....
$$

where $\delta_t=r(s_t,a_t)+\gamma V(s_{t+1})-V(s_t)$ is the temporal difference error. The GAE method stablizes the advantage function, helping PPO produce smoother updates.

## PPO Training Process

The training process for PPO consiste of:

1. Rollout Collections: Generate trajectories by running the current policy in the environment, storing states, actions, rewards and estimated values for each step.

1. Advantage Estimate: Use GAE to compute advantages for each (state, action) pair in the trajectory.

1. Policy Update: Perform several epochs of gradient ascent using the PPO objective. Within each epoch, PPO samples mini-batches from the trajectories to reduce variance and improve sample efficiency.

1. Value function: PPO often includes a critic network that estimates the value function $V(s)$, which is updated alongside the policy network. The critic minimizes a **Mean Squared Error** (MSE) loss between its predictions and the actual observed returns.

### PPO clipping mechanishm

The clipping mechanism in PPO effectively `controls the size of each update`, which `stabilizes training`. It ensures that `large policy updates are prevented`, even if there’s a large advantage (high reward) for certain actions. This limitation prevents policy collapse, where the policy shifts too drastically in response to high-reward actions, keeping the learning process smoother and more reliable.

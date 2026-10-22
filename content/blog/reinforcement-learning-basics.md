---
title: "Reinforcement Learning Basics"
date: "2024-04-08"
category: "Learning"
tags: ["Foundations", "Reinforcement Learning"]
description: "This blog explains the basics of RL."
source: "https://www.notion.so/1358157ad43a801ba676e5a60518ff47"
---

Reinforcement Learining (RL) is a type of machine learning where an agent learning to make a decision by interacting with an environment to achieve a goal.

## Core Components

- Agent: The decision maker. Its aim is to take actions that maximize its long-term rewards, ultimately learning a strategy (policy) that tells it which actions to take in different situations.

- Environment: The space in which the agent operates.

- Actions (a): The set of possible moves an agent can do. The set of actions varies depending on the state and the nature of the environment (e.g., continuous or discrete).

- States (s): The various situations the agent can be in within an environment. States can be a simple variable (like a location) or a complex set of variables (such as an image in robotics). Each state provides the context in which the agent decides its next move.

- Reward (R): A feedback signal that indicates the success of the agents actions.  The reward is a numerical signal given to the agent after each action, showing the immediate impact of that action

## Progress Flow

- The agent starts in an initial state.

- Based on its current policy, the agent chooses an action.

- The environment reacts to this action, transitioning the agent to a new state and providing a reward.

- The agent updates its policy based on the received reward and transitions to the next state.

- This process continues until the agent learns an optimal policy, meaning it knows the best action to take in every state to maximize cumulative rewards.

This loop can continue for many episodes, where each episode consists of a sequence of actions from a starting state to a terminal state.

## Policy and Value Functions

- Policy ($\pi$):  The policy is essentially a function or a mapping from states to actions. It dictates the behavior of the agent by specifying what action to take in each state. Policies can be:

    - **Deterministic**: Always choosing the same action for a given state.

    - **Stochastic**: Providing a probability distribution over actions for each state.

- Value Function (V): The value function V(s), estimates how good it is for the agent to be in a certain state. It provides the expected cumulative reward starting from that state and following the policy until the end of the episode.

## Learning Approaches

- Model-Free RL: In model-free approaches, the agent learns directly from interactions without a model of the environment. It relies on trial and error and includes algorithms like Q-learning, SARSA, and Deep Q-Networks (DQN).

    - Q-Learning: One of the most popular model-free methods, Q-learning is an off-policy algorithm where the agent learns Q-values, updating its estimates based on rewards received after taking actions. The agent then chooses actions that maximize its Q-values, learning an optimal policy over time.

    - Policy Gradient Methods: These are methods where the agent directly optimizes the policy by adjusting parameters to increase the expected rewards. Policy gradient methods are popular for continuous action spaces and are used in algorithms like REINFORCE, PPO (Proximal Policy Optimization), and A3C (Asynchronous Advantage Actor-Critic).

- Model-Based RL:  In model-based approaches, the agent tries to learn a model of the environment that predicts state transitions and rewards. The agent can then use this model to plan actions ahead, either through simulations or analytical methods, as seen in algorithms like Dyna-Q.

## Exploration vs. Exploitaiton

- Exploration: Exploration is the process of trying new actions, even if they don’t yield high rewards immediately, to discover potentially better strategies. This helps the agent avoid getting stuck in suboptimal solutions.

- Exploitation: Exploitation is choosing the best-known action in a state to maximize rewards based on current knowledge. This is efficient for short-term rewards but can prevent the agent from discovering better strategies.

- While learning a policy the we have to find the right balance between exploration and exploitation for the agent to learn effectively.

    - $\epsilon$-greedy: The agent chooses a random action witht he probabailty $\epsilon$ and the best know action with probability $1-\epsilon$.

    - Decay Strategies: Gradually reducing exploration (lowering $\epsilon$ over time) as the agent learns more about the environment.

> RL is a powerful framework for building intelligent agents that learn from experience, but it often requires careful tuning and experimentation to achieve desirable results. Each step, from defining states and rewards to balancing exploration and exploitation, plays a critical role in shaping the agent’s learning journey.

## Type of RL problems

- Markov Decision Processes (MDPs): The standard Framewrk where the next state depends on the current state and action. MDPs are defined by the tuple ( 𝑆 , 𝐴 , 𝑃 , 𝑅 , $\gamma$ ), where: S is the set of states, A is the set of actions, P is the transistion probability, R is the reward function, $\gamma$ is the discount factor.

- Partially Observable MDPs (POMDPs): The agent doesn’t have full visibility of the environment and receives only partial observations, not the full state. This adds complexity, as the agent must make decisions based on uncertain information.

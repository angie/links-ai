import type OpenAi from "openai";

export const responses: OpenAi.Chat.Completions.ChatCompletion[] = [
  {
    id: "chatcmpl-85fdopf7wDigxLAUZMHgAhbHZb6I0",
    object: "chat.completion",
    created: 1696362400,
    model: "gpt-3.5-turbo-0613",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content:
            '{"summary":"The Circuit Breaker pattern is used to prevent cascading failures in software systems that make remote calls, by wrapping a protected function call in a circuit breaker object that monitors for failures and trips when a certain threshold is reached.","categories":["Software Development","Application Architecture"]}',
        },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 953,
      completion_tokens: 63,
      total_tokens: 1016,
    },
  },
  {
    id: "chatcmpl-85fddaDyk1Szon290SWpodJkXMM9D",
    object: "chat.completion",
    created: 1696362389,
    model: "gpt-3.5-turbo-0613",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content:
            '{"summary":"A missing girl in New York state was found safe after police used fingerprints left on a ransom note to track her down.","categories":["Law Enforcement"]}',
        },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 814,
      completion_tokens: 39,
      total_tokens: 853,
    },
  },
  {
    id: "chatcmpl-85fdRgZIE7sSuaDwjPSO6Nu6zs9Is",
    object: "chat.completion",
    created: 1696362377,
    model: "gpt-3.5-turbo-0613",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: `{"summary":"Referees' body PGMOL has released the full audio from the VAR hub relating to the Luis Diaz goal that was incorrectly disallowed in Tottenham Hotspur v Liverpool on Saturday.","categories":["Sports"]}`,
        },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 934,
      completion_tokens: 52,
      total_tokens: 986,
    },
  },
];

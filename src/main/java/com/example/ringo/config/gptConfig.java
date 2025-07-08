package com.example.ringo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class gptConfig {

    @Value("${openai.api.key}")
    private String openAiKey;

    @Value("${openai.prompt.template}")
    private String promptTemplate;

    @Value("${openai.model}")
    private String modelName;

    @Bean
    public RestTemplate template(){
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().add("Authorization", "Bearer " + openAiKey);
            return execution.execute(request, body);
        });
        return restTemplate;
    }

    public String getPrompt(String question) {
        return promptTemplate + question;
    }

    public String getModelName() {
        return modelName;
    }
}

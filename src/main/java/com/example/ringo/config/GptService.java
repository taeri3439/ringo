package com.example.ringo.config;


import com.example.ringo.command.ChatGPTRequest;
import com.example.ringo.command.ChatGPTResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
@RequiredArgsConstructor
public class GptService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private gptConfig gptConfig;

    public String askQuestion(String userInput) {
        System.out.println(">>> askQuestion 호출됨: " + userInput);
        String prompt = gptConfig.getPrompt(userInput);
        System.out.println("프롬프트: " + prompt);

        ChatGPTRequest request = new ChatGPTRequest(gptConfig.getModelName(), prompt);

        ChatGPTResponse response = restTemplate.postForObject(
                "https://api.openai.com/v1/chat/completions",
                request,
                ChatGPTResponse.class
        );

        if (response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
            String raw = response.getChoices().get(0).getMessage().getContent();
            String cleaned = cleanMarkdown(raw);
            System.out.println("정리된 응답:\n" + cleaned);
            return cleaned;        }

        return "응답이 없습니다.";
    }

    private String cleanMarkdown(String markdown) {
        if (markdown == null) return "";

        return markdown
                .replaceAll("([.!?])\\s+", "$1\n")   // 문장 끝나면 줄바꿈
                .replaceAll("(?m)^\\s{0,3}#{1,6}\\s*", "")        // #, ##, ### 제목 제거
                .replaceAll("\\*\\*(.*?)\\*\\*", "$1")           // **굵게** 제거
                .replaceAll("`{1,3}(.*?)`{1,3}", "$1")            // `코드`, ```코드``` 제거
                .replaceAll("(?m)^-{3,}$", "")                    // --- 구분선 제거
                .replaceAll("(?m)^\\*\\s*", "- ")                 // 리스트 * 를 - 로 바꿈
                .replaceAll("(?m)^\\d+\\.\\s*", "- ")             // 숫자 리스트 → - 로 바꿈
                .replaceAll("(?m)^-\\s*", "- ")         // 리스트 정리
                .replaceAll("(?m)^>\\s*", "")                     // 인용 블록 제거
                .replaceAll("[\\r\\n]+", "\n")                    // 여러 줄바꿈 → 한 줄바꿈
                .replaceAll("[ \\t]+", " ")
                .trim();
    }

}

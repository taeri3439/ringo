package com.example.ringo.controller;


import com.example.ringo.config.GptService;
import com.example.ringo.config.WhisperService;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/stt")
@RequiredArgsConstructor
public class STTController {


    private final WhisperService whisperService;
    private final GptService gptService;

    @PostMapping("/upload")
    public ResponseEntity<String> upload(@RequestParam MultipartFile file) {
        // 1. Whisper → 텍스트
        String sttText = whisperService.transcribe(file);

        // 2. GPT → 요약된 텍스트
        String prompt = "너는 it20년차 전문가야. 전문가답게 대답해줘. ㄴ다음 내용을 이해하기 쉽게 요약하고 핵심만 정리해서 알려줘. 불필요한 말투나 반복은 생략해줘:\n" + sttText;
        String cleaned = gptService.askQuestion(prompt);

        return ResponseEntity.ok(cleaned);
    }


}

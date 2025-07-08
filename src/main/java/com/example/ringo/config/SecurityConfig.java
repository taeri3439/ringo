package com.example.ringo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF 보호 비활성화
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // 모든 요청 인증 없이 허용
                )
                .formLogin().disable()    // 기본 로그인 폼 비활성화
                .httpBasic().disable();   // HTTP Basic 인증 비활성화
        return http.build();
    }

    @Bean
    public HttpFirewall allowUrlEncodedDoubleSlashHttpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        // URL에 인코딩된 이중 슬래시(%2F%2F) 허용 여부를 설정합니다.
        // 일반적인 '//'를 허용하려면 다른 설정이 필요할 수 있으나,
        // 이 설정이 연관된 경우가 많습니다.
        firewall.setAllowUrlEncodedDoubleSlash(true);
        // 필요에 따라 다른 규칙도 완화할 수 있습니다.
        // firewall.setAllowSemicolon(true);
        return firewall;
    }

}


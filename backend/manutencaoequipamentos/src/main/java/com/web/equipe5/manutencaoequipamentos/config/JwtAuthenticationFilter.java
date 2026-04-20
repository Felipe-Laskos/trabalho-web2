package com.web.equipe5.manutencaoequipamentos.config;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.web.equipe5.manutencaoequipamentos.service.JwtService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest requisicao, HttpServletResponse resposta, FilterChain chain) throws ServletException, IOException {
        String header = requisicao.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            try {
                Claims claims = jwtService.parse(header.substring(7));

                String email = claims.getSubject();
                String perfil = claims.get("perfil", String.class);

                Long userId = claims.get("user_id", Long.class);

                var auth = new UsernamePasswordAuthenticationToken(
                    new AuthenticatedPrincipal(userId, email, perfil),
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + perfil))
                );

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(requisicao));

                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (Exception ex) {}
        }

        chain.doFilter(requisicao, resposta);
    }

    public record AuthenticatedPrincipal(Long id, String email, String perfil) {}
}

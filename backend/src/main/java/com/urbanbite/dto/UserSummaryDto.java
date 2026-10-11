package com.urbanbite.dto;

import com.urbanbite.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDto {
    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private Role role;
    private boolean isVerified;
    private boolean isActive;
    private Long restaurantId;
}

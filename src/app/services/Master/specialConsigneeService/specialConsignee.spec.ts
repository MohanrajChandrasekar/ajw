import { TestBed, inject } from '@angular/core/testing';

import { SpecialConsigneeService } from './specialConsignee.service';

describe('specialConsigneeService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SpecialConsigneeService]
        });
    });
    
    it('should be created', inject([SpecialConsigneeService], (service: SpecialConsigneeService) => {
        expect(service).toBeTruthy();
    }));
});        
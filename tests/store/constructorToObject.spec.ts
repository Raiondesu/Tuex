import { constructorToObject } from '../../src/store'

describe('constructorToObject', () => {
  test('converts from simple plain object', () => {
    const obj = JSON.parse('{"admin_host":"http:\/\/kz.admin.stage.naimi.me","static_host":"http:\/\/static.stage.naimi.me\/NAIupVjPda","start_host":"http:\/\/start.perfumerlabs.com","upload_host":"http:\/\/testupload.naimi.kz","host":"http:\/\/kz.stage.naimi.me","review":{"Id":14836,"Mark":3,"Sum":null,"Text":null,"SpecialistId":42545,"UserId":null,"ClientId":80153,"TicketId":98368,"IsApproved":false,"IsRejected":false,"IsRequested":null,"SeoTitle":null,"Photos":[],"CreatedAt":"2018-02-02T16:35:54+06:00"},"ticket":{"Id":98368,"State":"open","Term":"short","IsHidden":false,"NbBids":3,"NbViews":47,"Code":"986914","PrivateCode":"7632182746","BidDeposit":0,"Photos":["x0ZBHGPFqXMwPcc"],"Source":2,"SourceId":null,"CityId":2,"ModeratorId":null,"ModeratedAt":null,"ClientId":80153,"CategoryId":null,"ServiceId":null,"WorkId":16,"Title":null,"Description":null,"CompanyName":null,"About":null,"Schedule":null,"Summary":"\u041f\u043e\u0432\u0435\u0441\u0438\u0442\u044c, \u0417\u0435\u0440\u043a\u0430\u043b\u043e, \u041a\u0430\u0440\u0442\u0438\u043d\u0443, \u041a\u0440\u043e\u043d\u0448\u0442\u0435\u0439\u043d \u0434\u043b\u044f \u0442\u0435\u043b\u0435\u0432\u0438\u0437\u043e\u0440\u0430, \u041d\u0430\u0442\u043e\u0447\u0438\u0442\u044c \u043d\u043e\u0436\u0438","Address":null,"Latitude":null,"Longitude":null,"SearchQuery":null,"ActedAt":"2018-02-09T16:04:34+06:00","ReviewedAt":"2018-02-09T16:04:33+06:00","ClosedAt":null,"CreatedAt":"2018-02-01T11:03:47+06:00","PublishedAt":"2018-02-07T10:19:28+06:00","ExpiredAt":"2018-02-08T10:19:28+06:00","ObservedAt":"2018-02-07T10:49:28+06:00","MaxBids":null,"RequiredDate":null,"RequiredTime":null,"PriceFrom":null,"PriceTo":null,"TrackLinkId":null,"CancelReasonId":null,"CancelReasonText":null,"Ip":"10.42.119.8\/32"},"block_reasons":[{"id":30,"type":50,"name":"\u0410\u043d\u043a\u0435\u0442\u0430 \u043d\u0435 \u0441\u043e\u043e\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u043f\u0440\u0430\u0432\u0438\u043b\u0430\u043c \u0441\u0430\u0439\u0442\u0430","priority":100,"is_notifiable":false},{"id":154,"type":50,"name":"\u0412\u0440\u0435\u043c\u0435\u043d\u043d\u0430\u044f \u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u043a\u0430","priority":100,"is_notifiable":false},{"id":54,"type":50,"name":"\u0414\u0440\u0443\u0433\u043e\u0435 (\u0443\u043a\u0430\u0437\u0430\u0442\u044c \u0432 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0438)","priority":50,"is_notifiable":false},{"id":153,"type":50,"name":"\u0416\u0430\u043b\u043e\u0431\u0430 \u043e\u0442 \u0437\u0430\u043a\u0430\u0437\u0447\u0438\u043a\u0430","priority":100,"is_notifiable":false},{"id":24,"type":50,"name":"\u0418\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043d\u0438\u0435 \u0447\u0443\u0436\u0438\u0445 \u0434\u0430\u043d\u043d\u044b\u0445","priority":100,"is_notifiable":false},{"id":25,"type":50,"name":"\u041c\u043e\u0448\u0435\u043d\u043d\u0438\u0447\u0435\u0441\u0442\u0432\u043e","priority":50,"is_notifiable":false},{"id":158,"type":50,"name":"\u041d\u0430\u0440\u0443\u0448\u0435\u043d\u0438\u0435 \u043f\u0440\u0430\u0432\u0438\u043b \u043e\u0431\u0449\u0435\u043d\u0438\u044f \u0441 \u0437\u0430\u043a\u0430\u0437\u0447\u0438\u043a\u0430\u043c\u0438","priority":100,"is_notifiable":false},{"id":159,"type":50,"name":"\u041d\u0430\u0440\u0443\u0448\u0435\u043d\u0438\u0435 \u043f\u0440\u0430\u0432\u0438\u043b \u0440\u0430\u0431\u043e\u0442\u044b \u0441 \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a\u0430\u043c\u0438 \u0441\u0435\u0440\u0432\u0438\u0441\u0430","priority":100,"is_notifiable":false},{"id":160,"type":50,"name":"\u041d\u0435\u0434\u043e\u0441\u0442\u043e\u0432\u0435\u0440\u043d\u044b\u0439 \u043e\u0442\u0437\u044b\u0432","priority":100,"is_notifiable":false},{"id":26,"type":50,"name":"\u041d\u0435\u043a\u0430\u0447\u0435\u0441\u0442\u0432\u0435\u043d\u043d\u043e \u0432\u044b\u043f\u043e\u043b\u043d\u0438\u043b \u0440\u0430\u0431\u043e\u0442\u0443","priority":50,"is_notifiable":false},{"id":27,"type":50,"name":"\u041d\u0435 \u0441\u043e\u0433\u043b\u0430\u0441\u0435\u043d \u0441 \u0443\u0441\u043b\u043e\u0432\u0438\u044f\u043c\u0438 \u0441\u0435\u0440\u0432\u0438\u0441\u0430","priority":100,"is_notifiable":false},{"id":37,"type":50,"name":"\u041f\u043e\u0432\u0442\u043e\u0440\u043d\u0430\u044f \u0430\u043d\u043a\u0435\u0442\u0430","priority":100,"is_notifiable":false},{"id":155,"type":50,"name":"\u041f\u043e\u0441\u0440\u0435\u0434\u043d\u0438\u0447\u0435\u0441\u0442\u0432\u043e","priority":100,"is_notifiable":false},{"id":157,"type":50,"name":"\u041f\u0440\u0435\u043a\u0440\u0430\u0449\u0435\u043d\u0438\u0435 \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u0447\u0435\u0441\u0442\u0432\u0430","priority":100,"is_notifiable":false},{"id":55,"type":50,"name":"\u0421\u0430\u043c\u043e\u0441\u0442\u043e\u044f\u0442\u0435\u043b\u044c\u043d\u043e\u0435 \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u0435 \u0430\u043d\u043a\u0435\u0442\u044b","priority":100,"is_notifiable":false}],"specialist_name":"\u0416\u0438\u0433\u0430\u0434\u043b\u043e\u0432 \u0415\u0432\u0433\u0435\u043d\u0438\u0439","client_name":"\u0415\u0432\u0433\u0435\u043d\u0438\u0439","user_name":null,"mode":"specialist"}')

    const { keys, plain } = constructorToObject(obj);

    expect(plain).toEqual(obj);
    expect(keys.length).toBe(Object.keys(obj).length);
  })

  test('converts from simple class', () => {
    class Simple {
      constructor() {
        this.e = 'buka';
      }
      a = 'asd';
      b = 12;
      c = null;
      d = false;
      e: string;
      f() {
        return 'test function';
      }
    }

    const { keys, plain } = constructorToObject(Simple);

    expect(keys.length).toBe(6);
    expect(keys).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);

    expect(plain.f()).toBe('test function');
  })

  test('converts from complex object', () => {
    const obj = {
      a: {
        x: 1,
        y: 2,
        z: 3
      },
      b: () => 'beee',
      c() { return 123; },
      get onetwothree() { return this.c(); },

      get x() { return this.a.x; },
      set x(value) { this.a.x = value; },

      set y(value) { this.a.y = value; }
    }

    const { keys, plain } = constructorToObject(obj);

    expect(keys.length).toBe(6);
    expect(keys).toEqual(['a', 'b', 'c', 'onetwothree', 'x', 'y']);

    expect(plain.b()).toBe('beee');
    expect(plain.onetwothree).toBe(123);
    expect(plain.a.x).toBe(plain.x);
    expect(plain.x).toBe(1);

    plain.x = 2;
    plain.y = 1;
    expect(plain.a.x).toBe(2);
    expect(plain.a.y).toBe(1);
  })

  test('converts from complex class', () => {
    class Parent {
      constructor() {
        this.parentProp = 'parent';
      }

      parentProp: string
    }

    class Complex extends Parent {
      constructor() {
        super();
        this.e = (arg: string) => {
          return arg + 's';
        };
      }
      a = {
        x: 'asd'
      };
      b = 12;
      c = null;
      d = false;
      e;
      get f() {
        return 'test function';
      }
    }

    const { keys, plain } = constructorToObject(Complex);

    expect(keys.length).toBe(7);
    expect(keys).toEqual(['parentProp', 'a', 'b', 'c', 'd', 'e', 'f']);

    expect(plain.f).toBe('test function');
    expect(plain.a.x).toBe('asd');
    expect(plain.parentProp).toBe('parent');
    expect(plain.e(plain.a.x)).toBe(plain.a.x + 's');
    expect(plain.e(plain.a.x)).toBe('asds');
  })

  test('handles exceptional cases with null', () => {
    const { keys, plain, proto } = constructorToObject(null);

    expect(keys).toEqual([]);
    expect(plain).toBeNull();
    expect(proto).toBeUndefined();
  })

  test('handles exceptional cases with undefined', () => {
    const { keys, plain, proto } = constructorToObject(undefined);

    expect(keys).toEqual([]);
    expect(plain).toBeUndefined();
    expect(proto).toBeUndefined();
  })
})
